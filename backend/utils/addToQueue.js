import {Queue} from 'bullmq'
import { Worker } from 'bullmq'
import { redisConnection } from '../config/redisConnection.js'

const embeddingQueue = new Queue('embedding-queue',{connection: redisConnection})
const similarityQueue = new Queue('similarity-queue',{ connection: redisConnection })


export const addContentToEmbeddingQueue = async (id, type) => {
    await embeddingQueue.add('generate_embedding',{id:id, type:type},{
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

export const addContentToSimilarityQueue = async (id) => {
    await similarityQueue.add('compare_embeddings',{id: id,},{
        attempts: 5,
        backoff:{
            type:"exponential",
            delay:1000*60*2 // 2 min
        },
        removeOnComplete: {
            age:3600,
            count:50,
        },
        removeOnFail:{
            age: 24*3600,
            count: 100,
        },
    })
}
