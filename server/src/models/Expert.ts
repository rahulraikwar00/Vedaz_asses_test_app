export interface Expert {
  id: number
  name: string
  category: string
  experience: number
  rating: number
  slots: Slot[]
}

export interface Slot {
  date: string
  time: string
}
