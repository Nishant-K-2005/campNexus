import { Worker } from "bullmq";
import { redisConnection } from "../config/redisConnection.js";
import { PostStatus } from "@prisma/client";
import { getPostById, getPostEmbedding, updatePost } from "../repositories/post.repo.js";
import { getCommunityById, getCommunityEmbedding } from "../repositories/community.repo.js";

const worker = new Worker(
    'similarity-queue',
    async job => {
        const scores_url = "http://localhost:8000/api/scores"
        const {id} = job.data

        const post = await getPostEmbedding(id);
        if(post.length === 0){
            throw new Error("Post not found");
        }
        const community = await getCommunityEmbedding(post[0].community_id)
        if(community.length === 0){
            throw new Error("Community not found");
        } 
        const embeddings = {
            categoryEmbedding: JSON.parse(community[0].embedding_vector),
            contentEmbedding: JSON.parse(post[0].embedding_vector)
        }
        const res = await fetch(scores_url,{
            method:'POST',
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(embeddings)
        })
        
        if(!res.ok){
            console.log("Score API failed");
            throw new Error("score api failed");
        }
        const data = await res.json();
        
        const isValid = data.score>=0.55;
        let status = PostStatus.Rejected
        if(isValid){
            status = PostStatus.Accepted
        }
        console.log("data: ",data.score, " status: ", status);
        await updatePost(id, {status})
        await redisConnection.publish('worker_notification', JSON.stringify({
            userId: post[0].user_id,
            postId:id,
            status: status,
            message: data.score >= 0.55
                ? "your post has been approved and is now live!"
                : "your post was rejected for not matching community guidelines."
        }))
    },
    { connection: redisConnection }
)

worker.on('completed', job => {
    console.log("Similarity Worker");
    console.log(`Job ${job.id} has completed!`);
})

worker.on('failed', (job, err) => {
    console.log("Similarity Worker");
    console.error(`Job ${job.id} has failed with error:`, err.message);
    console.error(err.stack);
})

worker.on('error', err => {
    console.log("Similarity Worker");
    console.error('Worker encountered an error:', err);
})