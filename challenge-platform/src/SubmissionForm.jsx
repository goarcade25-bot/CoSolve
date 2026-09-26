import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function SubmissionForm({ teamId, challengeId, challengeTitle }) {
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase
      .from('submissions')
      .insert([{ team_id: teamId, challenge_id: challengeId, content, link }])

    if (error) setMessage('Error: ' + error.message)
    else {
      setMessage('Submission sent successfully!')
      setContent('')
      setLink('')
    }
  }

  return (
    <div className="submission-box">
      <h5>Submit Proposal</h5>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe your solution..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ minHeight: 70 }}
          required
        />
        <input
          type="text"
          placeholder="Link (optional, e.g. GitHub repo or doc)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit" className="btn">Submit Proposal</button>
      </form>
      {message && <p className="success-msg" style={{ marginTop: 8 }}>{message}</p>}
    </div>
  )
}