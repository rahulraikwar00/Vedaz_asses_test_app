import { Schema, model } from 'mongoose'

const bookingSchema = new Schema({
  expertId: { type: Schema.Types.ObjectId, ref: 'Expert', required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' }
}, { timestamps: true })

bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true })

export default model('Booking', bookingSchema)
