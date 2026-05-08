import { useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import ExpertsScreen from './src/screens/ExpertsScreen'
import ExpertDetailScreen from './src/screens/ExpertDetailScreen'
import BookingScreen from './src/screens/BookingScreen'
import MyBookingsScreen from './src/screens/MyBookingsScreen'

export default function App() {
  const [state, setState] = useState({ screen: 'experts', params: {} as any })

  const navigate = (screen: string, params?: any) => setState({ screen, params })
  const goBack = () => setState({ screen: 'experts', params: {} })

  const renderScreen = () => {
    const nav = { navigate, goBack, params: state.params }
    switch (state.screen) {
      case 'experts': return <ExpertsScreen {...nav} />
      case 'expert-detail': return <ExpertDetailScreen {...nav} />
      case 'booking': return <BookingScreen {...nav} />
      case 'my-bookings': return <MyBookingsScreen {...nav} />
      default: return <ExpertsScreen {...nav} />
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
