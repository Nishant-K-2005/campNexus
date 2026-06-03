import IOredis, { Redis } from 'ioredis'

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null
}

export const redisConnection = new Redis(redisConfig)
export const redisSubscriber = redisConnection.duplicate()