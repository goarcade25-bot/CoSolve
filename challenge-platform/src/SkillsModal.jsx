import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function SkillsModal({ onComplete }) {
  const [skills, setSkills] = useState('')
  const [university, setUniversity] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, skills, university })

    if (error) {
      setMessage('Error: ' + error.message)
      return
    }

    onComplete()
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div className="card" style={{ maxWidth: 420, width: '90%' }}>
        <h4>Welcome to CoSolve 👋</h4>
        <p style={{ fontSize: 14, color: '#666' }}>
          Tell us a bit about you so we can recommend the best-matched challenges. You can edit this anytime from your Profile.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your skills (comma separated, e.g. web development, AI, design)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your university/college name"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            required
          />
          <button type="submit" className="btn" style={{ width: '100%' }}>Get Started</button>
        </form>
        {message && <p className="error-msg" style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  )
}