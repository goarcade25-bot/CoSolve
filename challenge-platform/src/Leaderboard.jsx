import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Leaderboard() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('teams').select('university')

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const counts = {}
    data.forEach((t) => {
      const uni = t.university || 'Not specified'
      counts[uni] = (counts[uni] || 0) + 1
    })

    const sorted = Object.entries(counts)
      .map(([university, count]) => ({ university, count }))
      .sort((a, b) => b.count - a.count)

    setRankings(sorted)
    setLoading(false)
  }

  if (loading) return <p>Loading leaderboard...</p>

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>🏆 University Leaderboard</h3>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
        Ranking by number of teams formed across all challenges — showcasing university-industry collaboration.
      </p>
      {rankings.length === 0 && <p>No teams formed yet.</p>}
      {rankings.map((r, i) => (
        <div key={r.university} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 'bold', color: i === 0 ? '#eab308' : '#4f46e5', width: 30 }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </span>
            <strong>{r.university}</strong>
          </div>
          <span className="tag">{r.count} team{r.count !== 1 ? 's' : ''}</span>
        </div>
      ))}
    </div>
  )
}