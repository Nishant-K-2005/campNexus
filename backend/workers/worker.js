import { Worker } from "bullmq";
import { redisConnection } from "../config/redisConnection.js";
import prisma from "../config/dbConnection.js";
import { PostStatus } from "@prisma/client";

const worker = new Worker(
    'moderation',
    async job => {
        const ai_service_url = "http://127.0.0.1:8000/scores/getScore"
        const { id } = job.data;
        const formData = new FormData();


        const content = await prisma.post.findUnique({
            where: {
                post_id: id,
            },
            include: {
                attachments: true
            }
        })

        const userId = content.user_id

        if (!content) {
            throw new Error("post not found")
        }

        formData.append(
            'text',
            content.content
        )
        if (content.attachments.length > 0) {
            const attachment = content.attachments[0]
            const resFile = await fetch(attachment.url)
            const arrayBuffer = await resFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer)
            formData.append(
                "file",
                new Blob([buffer]),
                attachment.title
            )
        }
        const community = await prisma.community.findUnique({
            where: {
                community_id: content.community_id
            }
        })

        if (!community) {
            throw new Error("community not found")
        }

        formData.append(
            "category",
            community.description
        )
        const res = await fetch(ai_service_url, {
            method: 'POST',
            body: formData
        })
        if (!res.ok) {
            throw new Error("AI moderation failed")
        }
        const data = await res.json()
        const postStatus = data.score >= 0.55 ? "Accepted" : "Rejected"
        const updatedPost = await prisma.post.update({
            where: { post_id: id },
            data: {
                status: postStatus,
                embedding_vector: data.content_embedding,
            }
        })
        console.log("your post is ", postStatus)
        await redisConnection.publish('worker_notification', JSON.stringify({
            userId,
            postId,
            status: postStatus,
            message: data.score >= 0.55
                ? "your post has been approved and is now live!"
                : "your post was rejected for not matching community guidelines."
        }))
    },
    { connection: redisConnection }
)

worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
})

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with error:`, err.message);
    console.error(err.stack);
})

worker.on('error', err => {
    console.error('Worker encountered an error:', err);
})