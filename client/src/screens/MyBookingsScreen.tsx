import { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native'
import { getBookingsByUserId } from '../services/api'
import { getDeviceId } from '../utils/deviceId'
import { Booking } from '../types'

export default function MyBookingsScreen({ goBack }: any) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const userId = await getDeviceId()
      const data = await getBookingsByUserId(userId)
      setBookings(data)
      setLoading(false)
    })()
  }, [])

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500'
      case 'confirmed': return '#008000'
      case 'completed': return '#0000FF'
      default: return '#000'
    }
  }

  const fetchBookings = async () => {
    setLoading(true)
    const userId = await getDeviceId()
    const data = await getBookingsByUserId(userId)
    setBookings(data)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Button title="< Back" onPress={goBack} />
      <Text style={styles.title}>My Bookings</Text>
      <Button title="Refresh" onPress={fetchBookings} disabled={loading} />
      {loading ? <ActivityIndicator /> : null}
      <FlatList
        data={bookings}
        keyExtractor={(item) => String(item._id)}
        ListEmptyComponent={<Text style={styles.empty}>No bookings yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.expertName}>{item.expertId?.name || 'Unknown Expert'}</Text>
            <Text>{item.date} at {item.timeSlot}</Text>
            <Text>Status: <Text style={{ color: statusColor(item.status), fontWeight: 'bold' }}>{item.status.toUpperCase()}</Text></Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },

  card: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  expertName: { fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
})
