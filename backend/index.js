import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import http from 'http'
import authRoutes from './routes/authRoute.js'
import communityRoutes from './routes/communityRoute.js'
import resourceRoutes from './routes/resourceRoute.js'
import discussionRoutes from './routes/discussionRoute.js'
import replyRoutes from './routes/replyRoute.js'
import { initSocket } from './socket/socket.js'
import './workers/ai.worker.js';

dotenv.config()

const app = express()
 
const port = process.env.PORT||5000

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const server = http.createServer(app)
initSocket(server)


app.use('/api/auth',authRoutes)
app.use('/api',communityRoutes)
app.use('/api',resourceRoutes)
app.use('/api',discussionRoutes)
app.use('/api',replyRoutes)

app.get('/',(req,res)=>{
    res.json({message:"campNexus Backend is online"})
})

server.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})
