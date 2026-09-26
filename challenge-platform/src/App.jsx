import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Sidebar from './Sidebar'
import Home from './Home'
import ChallengesPage from './ChallengesPage'
import OrgPage from './OrgPage'
import LeaderboardPage from './LeaderboardPage'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="auth-page">
        <Auth />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar onLogout={() => supabase.auth.signOut()} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home userEmail={session.user.email} />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/org" element={<OrgPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App