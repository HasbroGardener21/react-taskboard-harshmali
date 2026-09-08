import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login, register, authError, authLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Initialize the navigate function
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Prevent default form behavior if triggered by a form submit
    if (e) e.preventDefault(); 
    
    setError('');
    
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      
      // THE FIX: Once context finishes logging in/registering, change the page!
      navigate('/'); // Change this to '/dashboard' or whatever your main route is named
      
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

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
          onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
          style={{ width: '100%' }}
        />

        {(error || authError) && (
          <p className="error-msg" style={{ color: 'red' }}>{error || authError}</p>
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
  );
}

export default Login;