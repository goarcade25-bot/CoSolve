import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function PostChallenge({ onPosted }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [domain, setDomain] = useState('')
  const [orgName, setOrgName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.from('challenges').insert([
      { title, description, domain, org_name: orgName, deadline: deadline || null },
    ])

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Challenge posted!')
      setTitle('')
      setDescription('')
      setDomain('')
      setOrgName('')
      setDeadline('')
      if (onPosted) onPosted()
    }
  }

  if (!show) {
    return (
      <button className="btn" style={{ marginBottom: 20 }} onClick={() => setShow(true)}>
        + Post a New Challenge
      </button>
    )
  }

  return (
    <div className="card">
      <h4>Post a New Challenge</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Challenge title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ minHeight: 70 }}
          required
        />
        <input
          type="text"
          placeholder="Domain (e.g. Healthcare, Environment)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <input
          type="text"
          placeholder="Organization name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn">Post Challenge</button>
          <button type="button" className="btn btn-outline" style={{ color: '#4f46e5', border: '1px solid #4f46e5' }} onClick={() => setShow(false)}>
            Cancel
          </button>
        </div>
      </form>
      {message && <p className="success-msg" style={{ marginTop: 8 }}>{message}</p>}
    </div>
  )
}