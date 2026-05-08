import { Request, Response } from 'express'
import Booking from '../models/Booking'
import Expert from '../models/Expert'

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { expertId, userId, userName, email, phone, date, timeSlot, notes } = req.body

    const existing = await Booking.findOne({ expertId, date, timeSlot })
    if (existing) return res.status(409).json({ error: 'Slot already booked' })

    const booking = await Booking.create({ expertId, userId, userName, email, phone, date, timeSlot, notes })

    const io = (req as any).io
    io.emit('slot-booked', { expertId, date, timeSlot })

    res.status(201).json({ message: 'Booking successful', booking })
  } catch (e: any) {
    if (e.code === 11000) return res.status(409).json({ error: 'Slot already booked' })
    res.status(500).json({ error: e.message })
  }
}

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!booking) return res.status(404).json({ error: 'Booking not found' })
    res.json(booking)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}

export const getBookingsByEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string
    const email = req.query.email as string

    let query: any = {}
    if (userId) query.userId = userId
    else if (email) query.email = email
    else return res.json([])

    const bookings = await Booking.find(query).populate('expertId', 'name').sort({ date: -1, timeSlot: -1 })
    res.json(bookings)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
