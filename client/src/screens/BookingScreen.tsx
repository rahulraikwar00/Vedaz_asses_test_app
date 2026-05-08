import { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { createBooking } from '../services/api'
import { getDeviceId } from '../utils/deviceId'

export default function BookingScreen({ goBack, params }: any) {
  const { expertId, date, time } = params
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    getDeviceId().then(setUserId)
  }, [])

  const handleBooking = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Name, email and phone are required')
      return
    }
    setLoading(true)
    try {
      await createBooking({ expertId, userId, userName: name, email, phone, date, timeSlot: time, notes })
      Alert.alert('Success', 'Booking confirmed!')
      goBack()
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Button title="< Back" onPress={goBack} />
      <Text style={styles.title}>Book Session</Text>
      <Text>Date: {date} | Time: {time}</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes} style={styles.input} multiline />
      <Button title={loading ? 'Booking...' : 'Confirm Booking'} onPress={handleBooking} disabled={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
})
