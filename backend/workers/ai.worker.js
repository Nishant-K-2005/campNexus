import { Worker } from "bullmq";
import { redisConnection } from "../config/redisConnection.js";
import { getCommunityById, getCommunityEmbedding, updateCommunity, updateCommunityEmbedding } from "../repositories/community.repo.js";
import { getPostById, updatePost, updatePostEmbedding } from "../repositories/post.repo.js";
import { PostStatus } from "@prisma/client";

async function generateEmbedding(id, type) {
    const formData = new FormData()
    let content = '';
    let dbObj = null;
    if (type === 'community') {
        dbObj = await getCommunityById(id);
        if (!dbObj) {
            throw new Error("Community not found");
        }
        content += dbObj.description + dbObj.tags.join(" ");
    } else {
        dbObj = await getPostById(id);
        if (!dbObj) {
            throw new Error("Post not found")
        }
        content += dbObj.content;
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
    formData.append("text", content);
    const res = await fetch("http://localhost:8000/api/embeddings", {
        method: 'POST',
        body: formData
    })
    if (!res.ok) {
        throw new Error("Embedding Service failed");
    }
    const data = await res.json()
    return {
        embedding:data.embedding, dbObj
    }
}


async function fetchScore(categoryEmbedding, contentEmbedding) {
    const res = await fetch("http://localhost:8000/api/scores", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ categoryEmbedding, contentEmbedding })
    })
    if (!res) {
        console.log("Score API failed");
        throw new Error("Score API failed");
    }
    const data = await res.json();
    return data.score;
}

const worker = new Worker(
    'ai-queue',
    async job => {
        const { id, type } = job.data;

        const { embedding, dbObj } = await generateEmbedding(id, type);

        if (type === 'community') {
            await updateCommunityEmbedding(id, embedding)
        } else {
            await updatePostEmbedding(id, embedding);
            let categoryEmbedding = await getCommunityEmbedding(dbObj.community_id);
            categoryEmbedding = JSON.parse(categoryEmbedding[0].embedding_vector)
            const score = await fetchScore(categoryEmbedding,embedding);

            const isValid = score >= 0.55;
            let status = PostStatus.Rejected
            if (isValid) {
                status = PostStatus.Accepted
            }
            console.log("data: ", score, " status: ", status);
            await updatePost(id, { status })
            await redisConnection.publish('worker_notification', JSON.stringify({
                userId: dbObj.user_id,
                postId: id,
                status: status,
                message: score >= 0.55
                    ? "your post has been approved and is now live!"
                    : "your post was rejected for not matching community guidelines."
            }))
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