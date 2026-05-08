export interface Booking {
  id: number
  expertId: number
  userName: string
  email: string
  phone: string
  date: string
  timeSlot: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed'
}

export interface BookingRow {
  id: number
  expertId: number
  userName: string
  email: string
  phone: string
  date: string
  timeSlot: string
  notes: string | null
  status: string
}
