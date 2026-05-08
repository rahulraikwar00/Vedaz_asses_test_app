import axios from 'axios'
import { Expert, Booking } from '../types'

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.11:5000'
})

export const getExperts = async (page = 1, search = '', category = '') => {
  const { data } = await api.get<{ experts: Expert[]; totalPages: number; currentPage: number }>('/experts', {
    params: { page, search, category }
  })
  return data
}

export const getExpertById = async (id: string) => {
  const { data } = await api.get<Expert>(`/experts/${id}`)
  return data
}

export const createBooking = async (booking: any) => {
  const { data } = await api.post<{ message: string; booking: Booking }>('/bookings', booking)
  return data
}

export const getBookingsByEmail = async (email: string) => {
  const { data } = await api.get<Booking[]>('/bookings', { params: { email } })
  return data
}

export const getBookingsByUserId = async (userId: string) => {
  const { data } = await api.get<Booking[]>('/bookings', { params: { userId } })
  return data
}
