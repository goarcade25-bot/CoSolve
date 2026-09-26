import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Link } from 'react-router-dom'

export default function Home({ userEmail }) {
  const [stats, setStats] = useState({ challenges: 0, teams: 0, submissions: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { count: challengeCount } = await supabase.from('challenges').select('*', { count: 'exact', head: true })
    const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true })
    const { count: submissionCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true })

    setStats({
      challenges: challengeCount || 0,
      teams: teamCount || 0,
      submissions: submissionCount || 0,
    })
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Welcome back 👋</h1>
          <p>{userEmail}</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card coral">
          <div className="stat-icon">🎯</div>
          <p className="stat-value">{stats.challenges}</p>
          <p className="stat-label">Challenges Live</p>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">👥</div>
          <p className="stat-value">{stats.teams}</p>
          <p className="stat-label">Teams Formed</p>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">📝</div>
          <p className="stat-value">{stats.submissions}</p>
          <p className="stat-label">Solutions Submitted</p>
        </div>
      </div>

      <div className="card">
        <h4>Ready to solve something real?</h4>
        <p>Browse open challenges from universities, government bodies, and industry partners.</p>
        <Link to="/challenges">
          <button className="btn">Browse Challenges →</button>
        </Link>
      </div>
    </div>
  )
}