import prisma from "../config/dbConnection.js";
import uploadFile from "../services/storage.service.js";

export const getPost = (community_id, type) => {
    return prisma.post.findMany({
        where: {
            community_id,
            type,
            status: "Accepted",
        },
        include: {
            attachments: true,
            user: true
        },
        orderBy: {
            created_at: "desc",
        }
    })
}

export const createPost = ({ user_id, community_id, content, type, attachmentData }) => {
    return prisma.$transaction(async (tx) => {
        const newPost = await tx.post.create({
            data: {
                user_id,
                community_id,
                content,
                type
            }
        })
        const postAttachment = await tx.postAttachment.create({
            data: {
                post_id: newPost.post_id,
                type: attachmentData.type,
                url: attachmentData.url,
                title: attachmentData.title
            }
        })
        return [newPost, postAttachment]
    })
}