import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function OrgDashboard() {
  const [challenges, setChallenges] = useState([])
  const [submissionsByChallenge, setSubmissionsByChallenge] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })

    if (challengeError) {
      console.error(challengeError)
      setLoading(false)
      return
    }

    setChallenges(challengeData)

    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .select('*, teams(team_name)')
      .order('created_at', { ascending: false })

    if (submissionError) {
      console.error(submissionError)
      setLoading(false)
      return
    }

    const grouped = {}
    submissionData.forEach((s) => {
      if (!grouped[s.challenge_id]) grouped[s.challenge_id] = []
      grouped[s.challenge_id].push(s)
    })
    setSubmissionsByChallenge(grouped)
    setLoading(false)
  }

  const markShortlisted = async (submissionId) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'shortlisted' })
      .eq('id', submissionId)

    if (!error) loadData()
  }

  if (loading) return <p>Loading dashboard...</p>

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Org Dashboard — Submissions Overview</h3>
      {challenges.map((c) => {
        const subs = submissionsByChallenge[c.id] || []
        return (
          <div key={c.id} className="card">
            <h4>{c.title}</h4>
            <small style={{ color: '#777' }}>{subs.length} submission(s)</small>
            {subs.length === 0 && <p style={{ marginTop: 8 }}>No submissions yet.</p>}
            {subs.map((s) => (
              <div key={s.id} className="submission-box">
                <p><strong>Team:</strong> {s.teams?.team_name || 'Unknown'}</p>
                <p>{s.content}</p>
                {s.link && <p><a href={s.link} target="_blank" rel="noreferrer">{s.link}</a></p>}
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: s.status === 'shortlisted' ? '#16a34a' : '#777' }}>
                    {s.status}
                  </span>
                </p>
                {s.status !== 'shortlisted' && (
                  <button className="btn" onClick={() => markShortlisted(s.id)}>
                    Mark as Shortlisted
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}