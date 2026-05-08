import { Request, Response } from 'express'
import { getDB } from '../utils/db'
import { Expert, Slot } from '../models/Expert'

export const getExperts = (req: Request, res: Response) => {
  try {
    const db = getDB()
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = (req.query.search as string) || ''
    const category = (req.query.category as string) || ''
    const skip = (page - 1) * limit

    let where = 'WHERE 1=1'
    const params: any[] = []

    if (search) {
      where += ' AND name LIKE ?'
      params.push(`%${search}%`)
    }
    if (category) {
      where += ' AND category LIKE ?'
      params.push(`%${category}%`)
    }

    const total = (db.prepare(`SELECT COUNT(*) as count FROM experts ${where}`).get(...params) as any).count

    const rows = db.prepare(`SELECT * FROM experts ${where} LIMIT ? OFFSET ?`).all(...params, limit, skip)

    const experts: Expert[] = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      experience: r.experience,
      rating: r.rating,
      slots: JSON.parse(r.slots)
    }))

    res.json({ experts, totalPages: Math.ceil(total / limit), currentPage: page })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}

export const getExpertById = (req: Request, res: Response) => {
  try {
    const db = getDB()


    const id = parseInt(req.params.id as string)
    const row = db.prepare('SELECT * FROM experts WHERE id = ?').get(id) as any

    const bookings = db.prepare('SELECT date, timeSlot FROM bookings WHERE expertId = ?').all(row.id)

    const slots: Slot[] = JSON.parse(row.slots)
    const bookedSlots = bookings.map((b: any) => ({ date: b.date, time: b.timeSlot }))

    res.json({
      id: row.id,
      name: row.name,
      category: row.category,
      experience: row.experience,
      rating: row.rating,
      slots,
      bookedSlots
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
