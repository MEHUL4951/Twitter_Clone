import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const connectDB = async ()=>{
    try{
       const  DB_OPTION = {
            user:"Admin",
            pass:"admin@8780",
            dbName:"twitter_clone",
        }
        const conn = await mongoose.connect(process.env.DATABASE_URL,DB_OPTION)
        console.log("connect to mongodb")

    }catch(err){
        console.log(`${err.message}`)
    }
}
export default connectDB



