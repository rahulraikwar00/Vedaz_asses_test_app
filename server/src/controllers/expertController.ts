import { Request, Response } from 'express'
import Expert from '../models/Expert'
import Booking from '../models/Booking'

export const getExperts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = (req.query.search as string) || ''
    const category = (req.query.category as string) || ''
    const skip = (page - 1) * limit

    let query: any = {}
    if (search) query.name = { $regex: search, $options: 'i' }
    if (category) query.category = { $regex: category, $options: 'i' }

    const experts = await Expert.find(query).skip(skip).limit(limit)
    const total = await Expert.countDocuments(query)

    res.json({ experts, totalPages: Math.ceil(total / limit), currentPage: page })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}

export const getExpertById = async (req: Request, res: Response) => {
  try {
    const expert = await Expert.findById(req.params.id)
    if (!expert) return res.status(404).json({ error: 'Expert not found' })

    const bookings = await Booking.find({ expertId: expert._id })
    const bookedSlots = bookings.map(b => ({ date: b.date, time: b.timeSlot }))

    res.json({ ...expert.toObject(), bookedSlots })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
