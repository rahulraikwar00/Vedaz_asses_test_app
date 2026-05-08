import { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native'
import { getBookingsByEmail } from '../services/api'
import { Booking } from '../types'

export default function MyBookingsScreen({ goBack }: any) {
  const [filterEmail, setFilterEmail] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async (email?: string) => {
    setLoading(true)
    try {
      const data = await getBookingsByEmail(email || '')
      setBookings(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

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
      <Text style={styles.title}>All Bookings</Text>
      <View style={styles.searchRow}>
        <TextInput placeholder="Filter by email" value={filterEmail} onChangeText={setFilterEmail} style={styles.input} keyboardType="email-address" />
        <Button title="Filter" onPress={() => fetchBookings(filterEmail)} disabled={loading} />
      </View>
      {loading ? <ActivityIndicator /> : null}
      <FlatList
        data={bookings}
        keyExtractor={(item) => String(item._id)}
        ListEmptyComponent={<Text style={styles.empty}>No bookings found</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.expertName}>{item.expertId.name}</Text>
            <Text>{item.date} at {item.timeSlot}</Text>
            <Text>Booked by: {item.userName} ({item.email})</Text>
            <Text style={{ color: statusColor(item.status), fontWeight: 'bold' }}>{item.status.toUpperCase()}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchRow: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, marginRight: 8, borderRadius: 4 },
  card: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  expertName: { fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
})
