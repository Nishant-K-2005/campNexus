import {Queue} from 'bullmq'
import { Worker } from 'bullmq'
import { redisConnection } from '../config/redisConnection.js'

const aiQueue = new Queue('ai-queue',{connection: redisConnection})


export const addContentToAiQueue = async (id, type) => {
    await aiQueue.add('generate_embedding',{id:id, type:type},{
        attempts: 5,
        backoff:{
            type:"exponential",
            delay: 1000*60*2,
        },
        removeOnComplete: {
            age:3600,
            count:50,
        },
        removeOnFail:{
            age:24*3600,
            count:100,
        }
    })
}
