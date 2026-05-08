import AsyncStorage from '@react-native-async-storage/async-storage'

const DEVICE_ID_KEY = '@device_id'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

let cachedId: string | null = null

export async function getDeviceId(): Promise<string> {
  if (cachedId) return cachedId

  let id = await AsyncStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = generateId()
    await AsyncStorage.setItem(DEVICE_ID_KEY, id)
  }
  cachedId = id
  return id
}
