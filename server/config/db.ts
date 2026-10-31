import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB connected')
    })
    await mongoose.connect(process.env.MONGODB_URI as string)
}

export default connectDB;