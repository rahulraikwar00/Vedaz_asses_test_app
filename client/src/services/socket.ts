import io from 'socket.io-client'
import { getExpertById } from './api'

let socket: any = null

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.11:5000')
  }
  return socket
}

export const subscribeToSlotBooked = (expertId: string, callback: () => void) => {
  const socket = getSocket()
  socket.on('slot-booked', (data: any) => {
    if (data.expertId === expertId) callback()
  })
  return () => socket.off('slot-booked')
}
