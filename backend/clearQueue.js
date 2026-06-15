// ------------------FILE THAT DELETES EVERYTHING FROM REDIS QUEUE--------------------------------
// ------------------Need to run it only when needed----------------------

import { Queue } from 'bullmq';
import { redisConnection } from './config/redisConnection.js';

const myQueue = new Queue('ai-queue', { connection: redisConnection });

async function wipeQueue() {
    console.log("Wiping the queue entirely...");
    // This deletes EVERYTHING: completed, waiting, active, delayed, and failed.
    await myQueue.obliterate({ force: true });
    console.log("Queue is now completely empty!");
    process.exit(0);
}

wipeQueue();