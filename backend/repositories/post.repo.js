import prisma from "../config/dbConnection.js";
import uploadFile from "../services/storage.service.js";
import { Prisma } from "@prisma/client";

export const getPostsByCommunityId = (community_id, type) => {
    return prisma.post.findMany({
        where: {
            community_id,
            type,
            status: "Accepted",
            deleted_at:null,
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

export const getPostById = (post_id) => {
    return prisma.post.findFirst({
        where:{
            post_id,
            deleted_at:null
        },
        include:{attachments: true}
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
        let postAttachment = null;
        if(attachmentData){
            postAttachment = await tx.postAttachment.create({
            data: {
                post_id: newPost.post_id,
                type: attachmentData.type,
                url: attachmentData.url,
                title: attachmentData.title
            }
            })
        }
        return [newPost, postAttachment]
    })
}

export const updatePost = (id, changes) => {
    return prisma.post.update({
        where:{post_id:id},
        data:changes
    })
}

export const updatePostEmbedding = (id, embedding) => {
    return prisma.$executeRaw`
        UPDATE "Post"
        SET embedding_vector = ${`[${embedding.join(",")}]`}::vector
        WHERE post_id = ${id} AND deleted_at IS NULL
    `;
}

export const getPostEmbedding = (id) => {
    return prisma.$queryRaw`
        SELECT 
        user_id, 
        community_id,
        embedding_vector::text AS embedding_vector
        FROM "Post"
        WHERE post_id = ${id} AND deleted_at IS NULL
    `;
}

export const deletePostById = (post_id) => {
    return prisma.post.update({
        where:{
            post_id,
            deleted_at:null
        },
        data:{
            deleted_at: new Date()
        }
    })
}