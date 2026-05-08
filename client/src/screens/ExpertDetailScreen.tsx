import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native'
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

  const dateGroups = Object.entries(slotsByDate)

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{expert.name}</Text>
      <Text>{expert.category} &bull; {expert.experience} yrs &bull; {expert.rating.toFixed(1)}</Text>
      <Text style={styles.subtitle}>Available Slots</Text>
      {dateGroups.map(([date, slots]: any) => (
        <View key={date} style={styles.dateGroup}>
          <Text style={styles.date}>{date}</Text>
          {slots.map((slot: any, idx: number) => (
            <TouchableOpacity
              key={`${date}-${idx}`}
              style={[styles.slotBtn, slot.booked && styles.slotDisabled]}
              disabled={slot.booked}
              onPress={() => navigate('booking', { expertId: id, date, time: slot.time })}
            >
              <Text style={[styles.slotText, slot.booked && styles.slotTextDisabled]}>
                {slot.time} {slot.booked ? '(Booked)' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center' },
  backBtn: { marginBottom: 8 },
  backText: { color: '#007AFF', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  dateGroup: { marginBottom: 16 },
  date: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  slotBtn: { padding: 10, backgroundColor: '#007AFF', borderRadius: 4, marginBottom: 6, alignItems: 'center' },
  slotDisabled: { backgroundColor: '#ccc' },
  slotText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  slotTextDisabled: { color: '#888' },
  error: { color: 'red', padding: 16 },
})
