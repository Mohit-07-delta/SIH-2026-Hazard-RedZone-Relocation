import { useState } from 'react'
import './App.css'
import LandingPage from './components/LandingPage'
import EmergencyDashboard from './components/EmergencyDashboard'
import UserDashboard from './components/UserDashboard'

type Page = 'landing' | 'emergency' | 'user'

function App() {
  const [page, setPage] = useState<Page>('landing')

  if (page === 'emergency') {
    return <EmergencyDashboard onBack={() => setPage('landing')} />
  }

  if (page === 'user') {
    return <UserDashboard onBack={() => setPage('landing')} />
  }

  return (
    <LandingPage
      onNavigate={(role) => {
        if (role === 'emergency') {
          setPage('emergency')
        } else if (role === 'user') {
          setPage('user')
        } else {
          console.log(`navigate to ${role}`)
        }
      }}
    />
  )
}

export default App
