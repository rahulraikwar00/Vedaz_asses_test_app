import { Schema, model } from 'mongoose'

const expertSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, required: true },
  slots: [{
    date: { type: String, required: true },
    time: { type: String, required: true }
  }]
}, { timestamps: true })

export default model('Expert', expertSchema)
