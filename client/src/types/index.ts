export interface Expert {
  id: number
  name: string
  category: string
  experience: number
  rating: number
  slots: { date: string; time: string }[]
  bookedSlots: { date: string; time: string }[]
}

export interface Booking {
  _id: string
  expertId: { _id: string; name: string }
  userName: string
  email: string
  phone: string
  date: string
  timeSlot: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed'
}
