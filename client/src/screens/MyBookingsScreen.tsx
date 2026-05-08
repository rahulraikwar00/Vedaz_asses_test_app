import { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native'
import { getBookingsByUserId } from '../services/api'
import { getDeviceId } from '../utils/deviceId'
import { Booking } from '../types'

export default function MyBookingsScreen({ goBack }: any) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBookings = async () => {
    setError('')
    try {
      const userId = await getDeviceId()
      const data = await getBookingsByUserId(userId)
      setBookings(data)
    } catch (e: any) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBookings() }, [])

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500'
      case 'confirmed': return '#008000'
      case 'completed': return '#0000FF'
      default: return '#000'
    }
  }

  return (
    <View style={styles.container}>
      <Button title="< Back" onPress={goBack} />
      <Text style={styles.title}>My Bookings</Text>
      <Button title="Refresh" onPress={loadBookings} disabled={loading} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
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
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
})
