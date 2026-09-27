import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import SubmissionForm from './SubmissionForm'
import PostChallenge from './PostChallenge'

function calculateMatchScore(challenge, skillsText) {
  if (!skillsText) return 0
  const skills = skillsText.toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
  const challengeText = `${challenge.title} ${challenge.description} ${challenge.domain}`.toLowerCase()
  let score = 0
  skills.forEach(skill => {
    if (skill && challengeText.includes(skill)) score += 1
  })
  return score
}

export default function ChallengeList() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [joinedTeams, setJoinedTeams] = useState({})
  const [mySkills, setMySkills] = useState('')
  const [myUniversity, setMyUniversity] = useState('')

  useEffect(() => {
    fetchChallenges()
    loadProfile()
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
      setMySkills(data.skills || '')
      setMyUniversity(data.university || '')
    }
  }

  const fetchChallenges = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setChallenges(data)
    setLoading(false)
  }

  const handlePosted = () => {
    fetchChallenges()
  }

  const handleJoin = async (challengeId, challengeTitle) => {
    setMessage('')
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMessage('You must be logged in to join.')
      return
    }

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert([{
        challenge_id: challengeId,
        team_name: `Team ${Math.random().toString(36).substring(2, 7).toUpperCase()}`,,
        created_by: user.id,
        university: myUniversity || 'Not specified',
      }])
      .select()
      .single()

    if (teamError) {
      setMessage('Error creating team: ' + teamError.message)
      return
    }

    const { error: memberError } = await supabase
      .from('team_members')
      .insert([{ team_id: team.id, user_id: user.id }])

    if (memberError) {
      setMessage('Error joining team: ' + memberError.message)
      return
    }

    setJoinedTeams((prev) => ({ ...prev, [challengeId]: team.id }))
    setMessage(`You joined "${challengeTitle}"! Submit your proposal below.`)
  }

  if (loading) return <p>Loading challenges...</p>

  const sortedChallenges = [...challenges].sort((a, b) => {
    return calculateMatchScore(b, mySkills) - calculateMatchScore(a, mySkills)
  })

  return (
    <div>
      {!mySkills && (
        <div className="card" style={{ background: '#fff3f0', border: '1px solid #ffcfc5' }}>
          <p style={{ margin: 0 }}>
            💡 Tip: Add your skills in your <a href="/profile">Profile</a> to get personalized challenge recommendations.
          </p>
        </div>
      )}

      <PostChallenge onPosted={handlePosted} />

      {message && <p className="success-msg">{message}</p>}
      {sortedChallenges.length === 0 && <p>No challenges yet.</p>}
      {sortedChallenges.map((c) => {
        const score = calculateMatchScore(c, mySkills)
        return (
          <div key={c.id} className="card">
            {score > 0 && (
              <span className="tag match" style={{ marginBottom: 8, display: 'inline-block' }}>
                🎯 Best Match
              </span>
            )}
            <h4>{c.title}</h4>
            <p>{c.description}</p>
            <div className="tag-row">
              <span className="tag">{c.domain || 'General'}</span>
              <span>Org: {c.org_name || 'N/A'}</span>
              <span>Deadline: {c.deadline || 'N/A'}</span>
            </div>
            {!joinedTeams[c.id] ? (
              <button className="btn" onClick={() => handleJoin(c.id, c.title)}>
                Join / Form Team
              </button>
            ) : (
              <SubmissionForm teamId={joinedTeams[c.id]} challengeId={c.id} challengeTitle={c.title} />
            )}
          </div>
        )
      })}
    </div>
  )
}