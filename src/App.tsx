import { useState } from 'react'
import './App.css'
import LandingPage from './components/LandingPage'
import EmergencyDashboard from './components/EmergencyDashboard'

type Page = 'landing' | 'emergency'

function App() {
  const [page, setPage] = useState<Page>('landing')

  if (page === 'emergency') {
    return <EmergencyDashboard onBack={() => setPage('landing')} />
  }

  return <LandingPage onNavigate={(role) => {
    if (role === 'emergency') {
      setPage('emergency')
    } else if (role === 'user') {
      const base = import.meta.env.BASE_URL || '/'
      window.location.href = `${base.replace(/\/$/, '')}/user.html`
    } else {
      console.log(`navigate to ${role}`)
    }
  }} />
}

export default App
