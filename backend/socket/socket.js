import { Server } from "socket.io";
import Redis from "ioredis";
import { redisSubscriber } from "../config/redisConnection.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "http://localhost:3000" }
    })
    redisSubscriber.subscribe('worker_notification', (err, count) => {
        if (err) {
            console.error("failed to subscribe to Redis channel:", err);
        } else {
            console.log(`server subscribed to ${count} redis channels.`);
        }
    })
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        const sId = "user_"+userId
        if (userId) {
            socket.join(sId)
            console.log(`${sId} came online`)
        }
        socket.on("disconnect", () => {
            console.log(`${sId} disconnected`)
        })
    })
    redisSubscriber.on("message", (channel, message) => {
        try{
            if (channel === "worker_notification") {
                const notifyData = JSON.parse(message)
                io.to("user_"+notifyData.userId.toString()).emit("moderation-data", notifyData)
            }
        }catch(err){
            console.log(`error parsing redis message on channel ${channel}: `,err.message)
        }
    })
}

export const getIo = () => {
    if(io){ 
        return io
    }else{
        throw new Error("io not initialized")
    }
}