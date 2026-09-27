import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Sidebar from './Sidebar'
import Home from './Home'
import ChallengesPage from './ChallengesPage'
import OrgPage from './OrgPage'
import LeaderboardPage from './LeaderboardPage'
import Profile from './Profile'
import SkillsModal from './SkillsModal'

function App() {
  const [session, setSession] = useState(null)
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [needsProfile, setNeedsProfile] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) checkProfile(session.user.id)
      else setCheckingProfile(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) checkProfile(session.user.id)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const checkProfile = async (userId) => {
    setCheckingProfile(true)
    const { data } = await supabase
      .from('profiles')
      .select('skills')
      .eq('id', userId)
      .maybeSingle()

    setNeedsProfile(!data || !data.skills)
    setCheckingProfile(false)
  }

  if (!session) {
    return (
      <div className="auth-page">
        <Auth />
      </div>
    )
  }

  if (checkingProfile) {
    return <div className="auth-page"><p>Loading...</p></div>
  }

  return (
    <BrowserRouter>
      {needsProfile && <SkillsModal onComplete={() => setNeedsProfile(false)} />}
      <div className="app-shell">
        <Sidebar onLogout={() => supabase.auth.signOut()} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home userEmail={session.user.email} />} />
            <Route path="/profile" element={<Profile userEmail={session.user.email} />} />
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