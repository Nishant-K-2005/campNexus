import prisma from "../config/dbConnection.js"

export const createReply = ({user_id, post_id, parent_id, content, depth}) => {
    return prisma.reply.create({
        data: {
            post_id,
            user_id,
            parent_id,
            content,
            depth,
        }
    })
}

export const getReplies = (post_id,parent_id=null) => {
    return prisma.reply.findMany({
        where: {
          post_id,
          parent_id
        },
        include: {
            user: {
                select: {
                    user_id: true,
                    email: true,
                    full_name: true,
                    role: true,
                }
            }
        },
        orderBy: {
            created_at: "desc",
        }
    })
}

export const getReply = (reply_id) => {
    console.log(reply_id,parent_id);
    return prisma.reply.findFirst({
        where:{
            reply_id,
        }
    })
}