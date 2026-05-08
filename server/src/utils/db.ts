import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/expert-booking'
  await mongoose.connect(uri)
  console.log('MongoDB connected')
}
