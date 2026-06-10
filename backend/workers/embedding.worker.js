import { Worker } from "bullmq";
import { redisConnection } from "../config/redisConnection.js";
import { getCommunityById, updateCommunity, updateCommunityEmbedding } from "../repositories/community.repo.js";
import { getPostById, updatePost, updatePostEmbedding } from "../repositories/post.repo.js";
import { addContentToSimilarityQueue } from "../utils/addToQueue.js";

const worker = new Worker(
    'embedding-queue',
    async job => {
        const embedding_url = "http://localhost:8000/api/embeddings";
        const { id,type } = job.data;
        const formData = new FormData();
        let content = '';

        if (type === 'community') {
            const dbObj = await getCommunityById(id);
            if(!dbObj){
                throw new Error("Community not found")
            }
            content += dbObj.description + dbObj.tags.join(" ");
        } else {
            const dbObj = await getPostById(id);
            if(!dbObj){
                throw new Error("Post not found")
            }
            content = dbObj.content;
            if (dbObj.attachments.length > 0) {
                const attachment = dbObj.attachments[0]
                const resFile = await fetch(attachment.url)
                const arrayBuffer = await resFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer)
                formData.append(
                    "file",
                    new Blob([buffer]),
                    attachment.title
                )
            }
        }
        formData.append(
            "text",
            content
        )

        const res = await fetch(embedding_url,{
            method:'POST',
            body:formData
        })

        if(!res.ok){
            console.log("Embedding API failed");
            throw new Error("embedding api failed");
        }

        const data = await res.json()

        if(type==='community'){
            const updateRes = await updateCommunityEmbedding(id, data.embedding)
        }else{
            const updateRes = await updatePostEmbedding(id, data.embedding)
            await addContentToSimilarityQueue(id);
        }
    },
    { connection: redisConnection }
)

worker.on('completed', job => {
    console.log("Embedding Worker");
    console.log(`Job ${job.id} has completed!`);
})

worker.on('failed', (job, err) => {
    console.log("Embedding Worker");
    console.error(`Job ${job.id} has failed with error:`, err.message);
    console.error(err.stack);
})

worker.on('error', err => {
    console.log("Embedding Worker");
    console.error('Worker encountered an error:', err);
})