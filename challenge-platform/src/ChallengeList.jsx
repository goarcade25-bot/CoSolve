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
  const [mySkills, setMySkills] = useState(localStorage.getItem('mySkills') || '')
  const [myUniversity, setMyUniversity] = useState(localStorage.getItem('myUniversity') || '')
  const [showSkillPrompt, setShowSkillPrompt] = useState(!localStorage.getItem('mySkills'))

  useEffect(() => {
    fetchChallenges()
  }, [])

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

  const saveSkillsAndUniversity = (e) => {
    e.preventDefault()
    localStorage.setItem('mySkills', mySkills)
    localStorage.setItem('myUniversity', myUniversity)
    setShowSkillPrompt(false)
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
        team_name: `${user.email}'s Team`,
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
      {showSkillPrompt && (
        <div className="card">
          <h4>Tell us about you</h4>
          <p style={{ fontSize: 14, color: '#666' }}>This helps us recommend the best-matched challenges for you.</p>
          <form onSubmit={saveSkillsAndUniversity}>
            <input
              type="text"
              placeholder="Your skills (comma separated, e.g. web development, AI, design)"
              value={mySkills}
              onChange={(e) => setMySkills(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your university/college name"
              value={myUniversity}
              onChange={(e) => setMyUniversity(e.target.value)}
            />
            <button type="submit" className="btn">Save & Continue</button>
          </form>
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