import { Request, Response } from 'express'
import { getDB } from '../utils/db'

export const createBooking = (req: Request, res: Response) => {
  try {
    const db = getDB()
    const { expertId, userName, email, phone, date, timeSlot, notes } = req.body

    const existing = db.prepare(
      'SELECT id FROM bookings WHERE expertId = ? AND date = ? AND timeSlot = ?'
    ).get(expertId, date, timeSlot)

    if (existing) return res.status(409).json({ error: 'Slot already booked' })

    const result = db.prepare(
      'INSERT INTO bookings (expertId, userName, email, phone, date, timeSlot, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(expertId, userName, email, phone, date, timeSlot, notes || null)

    const booking = {
      id: result.lastInsertRowid,
      expertId, userName, email, phone, date, timeSlot, notes, status: 'pending'
    }

    const io = (req as any).io
    io.emit('slot-booked', { expertId, date, timeSlot })

    res.status(201).json({ message: 'Booking successful', booking })
  } catch (e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE' || e.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Slot already booked' })
    }
    res.status(500).json({ error: e.message })
  }
}

export const updateBookingStatus = (req: Request, res: Response) => {
  try {
    const db = getDB()
    const { status } = req.body

    const id = parseInt(req.params.id as string)
    const result = db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id)

    if (result.changes === 0) return res.status(404).json({ error: 'Booking not found' })

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id)
    res.json(booking)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}

export const getBookingsByEmail = (req: Request, res: Response) => {
  try {
    const db = getDB()
    const email = req.query.email as string

    let query = `
      SELECT b.*, e.name as expertName
      FROM bookings b
      JOIN experts e ON e.id = b.expertId
    `
    const params: any[] = []

    if (email) {
      query += ' WHERE b.email = ?'
      params.push(email)
    }

    query += ' ORDER BY b.date DESC, b.timeSlot DESC'

    const bookings = db.prepare(query).all(...params)

    res.json(bookings.map((b: any) => ({
      _id: b.id,
      expertId: { _id: b.expertId, name: b.expertName },
      userName: b.userName,
      email: b.email,
      phone: b.phone,
      date: b.date,
      timeSlot: b.timeSlot,
      notes: b.notes,
      status: b.status
    })))
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
