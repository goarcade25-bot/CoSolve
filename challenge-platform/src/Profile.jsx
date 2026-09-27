import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Profile({ userEmail }) {
  const [skills, setSkills] = useState('')
  const [university, setUniversity] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ joined: 0, submitted: 0, shortlisted: 0 })

  useEffect(() => {
    loadProfile()
    loadStats()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('skills, university')
      .eq('id', user.id)
      .maybeSingle()

    if (data) {
      setSkills(data.skills || '')
      setUniversity(data.university || '')
    }
    setLoading(false)
  }

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Teams the user is part of
    const { data: memberRows } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)

    const teamIds = (memberRows || []).map((m) => m.team_id)

    let submittedCount = 0
    let shortlistedCount = 0

    if (teamIds.length > 0) {
      const { data: submissions } = await supabase
        .from('submissions')
        .select('status')
        .in('team_id', teamIds)

      submittedCount = submissions ? submissions.length : 0
      shortlistedCount = submissions ? submissions.filter(s => s.status === 'shortlisted').length : 0
    }

    setStats({
      joined: teamIds.length,
      submitted: submittedCount,
      shortlisted: shortlistedCount,
    })
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, skills, university })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Profile updated successfully!')
    }
  }

  if (loading) return <p>Loading profile...</p>

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>My Profile</h1>
          <p>{userEmail}</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card coral">
          <div className="stat-icon">🎯</div>
          <p className="stat-value">{stats.joined}</p>
          <p className="stat-label">Challenges Joined</p>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">📝</div>
          <p className="stat-value">{stats.submitted}</p>
          <p className="stat-label">Proposals Submitted</p>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🏆</div>
          <p className="stat-value">{stats.shortlisted}</p>
          <p className="stat-label">Times Shortlisted</p>
        </div>
      </div>

      <div className="card">
        <h4>Edit Your Details</h4>
        <p style={{ fontSize: 14, color: '#666' }}>Keep this updated so we recommend the best-matched challenges for you.</p>
        <form onSubmit={saveProfile}>
          <input
            type="text"
            placeholder="Your skills (comma separated, e.g. web development, AI, design)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your university/college name"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
          <button type="submit" className="btn">Save Changes</button>
        </form>
        {message && <p className="success-msg" style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  )
}