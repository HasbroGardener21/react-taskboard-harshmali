import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login, register, authError, authLoading } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) {
      setError('Email and password required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (isRegister) {
      await register(email, password)
    } else {
      await login(email, password)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'var(--bg)'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        width: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ width: '100%' }}
        />

        {(error || authError) && (
          <p className="error-msg">{error || authError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={authLoading}
          style={{ width: '100%', padding: '10px' }}
        >
          {authLoading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: 'var(--text)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login