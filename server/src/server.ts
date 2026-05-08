import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import expertRoutes from './routes/expertRoutes'
import bookingRoutes from './routes/bookingRoutes'
import { connectDB } from './utils/db'

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

const PORT = parseInt(process.env.PORT || '5000', 10)
connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`))
})
