import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setMessage(error.message); setIsError(true) }
      else { setMessage('Signed up! You can now log in.'); setIsError(false) }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setMessage(error.message); setIsError(true) }
      else window.location.reload()
    }
  }

  return (
    <div className="auth-box">
      <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn" style={{ width: '100%' }}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      {message && <p className={isError ? 'error-msg' : 'success-msg'} style={{ marginTop: 12 }}>{message}</p>}
      <button onClick={() => setIsSignUp(!isSignUp)} className="link-btn">
        {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  )
}