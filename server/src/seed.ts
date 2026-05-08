import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Expert from './models/Expert'

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expert-booking')
  await Expert.deleteMany({})

  await Expert.create([
    {
      name: 'John Doe',
      category: 'Finance',
      experience: 10,
      rating: 4.5,
      slots: [
        { date: '2026-05-10', time: '10:00 AM' },
        { date: '2026-05-10', time: '2:00 PM' },
        { date: '2026-05-11', time: '11:00 AM' }
      ]
    },
    {
      name: 'Jane Smith',
      category: 'Health',
      experience: 8,
      rating: 4.8,
      slots: [
        { date: '2026-05-10', time: '9:00 AM' },
        { date: '2026-05-11', time: '1:00 PM' }
      ]
    },
    {
      name: 'Bob Wilson',
      category: 'Tech',
      experience: 12,
      rating: 4.3,
      slots: [
        { date: '2026-05-10', time: '3:00 PM' },
        { date: '2026-05-11', time: '10:00 AM' }
      ]
    }
  ])

  console.log('Seed data inserted')
  process.exit(0)
}

run()
