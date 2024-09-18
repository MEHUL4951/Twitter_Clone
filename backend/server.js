import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
const app = express()
dotenv.config()

const port = process.env.PORT || '3000'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import notificationRoute from './routes/notificationRoute.js'
import connectDB from './db/connectMongoDB.js'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary} from 'cloudinary'
import cors from 'cors'
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const CORS_OPTIONS = {
    origin:"http://localhost:3000",
    credentials:true
  }
  app.use(cors(CORS_OPTIONS))

app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/posts",postRoute)
app.use("/api/v1/notifications",notificationRoute)

app.listen(port,()=>{
    console.log(`Server is listening on port http://localhost:${port}`)
    connectDB()
})
