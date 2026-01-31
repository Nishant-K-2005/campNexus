import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoute.js'

dotenv.config()

const app = express()

const port = process.env.PORT||5000

app.use(cors())
app.use(express.json())

app.use('/api/auth',authRoutes)
app.get('/',(req,res)=>{
    res.json({message:"campNexus Backend is online"})
})

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})