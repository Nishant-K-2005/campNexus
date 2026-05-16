import {Queue} from 'bullmq'
import { Worker } from 'bullmq'
import { redisConnection } from '../config/redisConnection.js'

const myQueue = new Queue('moderation',{ connection: redisConnection })

export const addContentToQueue = async (id) => {
    await myQueue.add('check_content',{id: id,},{
        removeOnComplete: {
            age:3600,
            count:50,
        },
        removeOnFail:{
            age: 24*3600,
            count: 100,
        }
    })
}
