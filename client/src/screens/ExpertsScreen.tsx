import { useState, useEffect, useCallback } from 'react'
import { FlatList, View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native'
import { getExperts } from '../services/api'
import { Expert } from '../types'

export default function ExpertsScreen({ navigate }: any) {
  const [experts, setExperts] = useState<Expert[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadExperts = useCallback(async (p: number, s: string, c: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await getExperts(p, s, c)
      return data
    } catch (e: any) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const data = await loadExperts(1, search, category)
      if (cancelled || !data) return
      setExperts(data.experts)
      setTotalPages(data.totalPages)
      setPage(1)
    }
    run()
    return () => { cancelled = true }
  }, [search, category, loadExperts])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Experts</Text>
      <TextInput placeholder="Search by name" value={search} onChangeText={setSearch} style={styles.input} />
      <TextInput placeholder="Filter by category" value={category} onChangeText={setCategory} style={styles.input} />
      {loading && page === 1 ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={experts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card} onTouchEnd={() => navigate('expert-detail', { id: item._id })}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.category} &bull; {item.experience} yrs &bull; {item.rating.toFixed(1)}</Text>
          </View>
        )}
        onEndReached={() => {
          if (page < totalPages && !loading) {
            loadExperts(page + 1, search, category).then(data => {
              if (data) {
                setExperts(prev => [...prev, ...data.experts])
                setPage(page + 1)
              }
            })
          }
        }}
        onEndReachedThreshold={0.5}
      />
      <Button title="My Bookings" onPress={() => navigate('my-bookings')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 4 },
  card: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' },
  error: { color: 'red' },
})
