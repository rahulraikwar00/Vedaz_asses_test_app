import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import expertRoutes from './routes/expertRoutes'
import bookingRoutes from './routes/bookingRoutes'
import { connectDB, getDB } from './utils/db'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL || '*' }
})

app.use(cors())
app.use(express.json())
app.use((req: any, _res, next) => {
  req.io = io
  next()
})

app.use('/experts', expertRoutes)
app.use('/bookings', bookingRoutes)

io.on('connection', (socket) => {
  console.log('Client connected')
  socket.on('disconnect', () => console.log('Client disconnected'))
})

connectDB()

const db = getDB()
const count = (db.prepare('SELECT COUNT(*) as count FROM experts').get() as any).count
if (count === 0) {
  console.log('Seeding database...')
  const insert = db.prepare(
    'INSERT INTO experts (name, category, experience, rating, slots) VALUES (?, ?, ?, ?, ?)'
  )
  const experts = [
    { name: 'John Doe', category: 'Finance', experience: 10, rating: 4.5, slots: [{ date: '2026-05-10', time: '10:00 AM' }, { date: '2026-05-10', time: '2:00 PM' }, { date: '2026-05-11', time: '11:00 AM' }] },
    { name: 'Jane Smith', category: 'Health', experience: 8, rating: 4.8, slots: [{ date: '2026-05-10', time: '9:00 AM' }, { date: '2026-05-11', time: '1:00 PM' }] },
    { name: 'Bob Wilson', category: 'Tech', experience: 12, rating: 4.3, slots: [{ date: '2026-05-10', time: '3:00 PM' }, { date: '2026-05-11', time: '10:00 AM' }] }
  ]
  const seedAll = db.transaction(() => {
    for (const e of experts) {
      insert.run(e.name, e.category, e.experience, e.rating, JSON.stringify(e.slots))
    }
  })
  seedAll()
  console.log('Seed complete')
}

const PORT = parseInt(process.env.PORT || '5000', 10)
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`))
