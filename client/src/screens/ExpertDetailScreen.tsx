import { useState, useEffect } from 'react'
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native'
import { getExpertById } from '../services/api'
import { subscribeToSlotBooked } from '../services/socket'
import { Expert } from '../types'

export default function ExpertDetailScreen({ navigate, goBack, params }: any) {
  const { id } = params
  const [expert, setExpert] = useState<Expert | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadExpert = async () => {
    try {
      const data = await getExpertById(id)
      setExpert(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpert()
    const unsubscribe = subscribeToSlotBooked(id, loadExpert)
    return unsubscribe
  }, [id])

  if (loading) return <ActivityIndicator style={styles.center} />
  if (error) return <Text style={styles.error}>{error}</Text>
  if (!expert) return null

  const slotsByDate = expert.slots.reduce((acc: any, slot) => {
    const isBooked = expert.bookedSlots.some(b => b.date === slot.date && b.time === slot.time)
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push({ ...slot, booked: isBooked })
    return acc
  }, {})

  return (
    <ScrollView style={styles.container}>
      <Button title="< Back" onPress={goBack} />
      <Text style={styles.title}>{expert.name}</Text>
      <Text>{expert.category} &bull; {expert.experience} yrs &bull; {expert.rating.toFixed(1)}</Text>
      <Text style={styles.subtitle}>Available Slots</Text>
      {Object.entries(slotsByDate).map(([date, slots]: any) => (
        <View key={date} style={styles.dateGroup}>
          <Text style={styles.date}>{date}</Text>
          {slots.map((slot: any) => (
            <View key={slot.date + slot.time} style={{ marginBottom: 4 }}>
              <Button
                title={slot.time}
                disabled={slot.booked}
                onPress={() => navigate('booking', { expertId: id, date, time: slot.time })}
                color={slot.booked ? '#ccc' : '#007AFF'}
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  dateGroup: { marginBottom: 16 },
  date: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  error: { color: 'red', padding: 16 },
})
