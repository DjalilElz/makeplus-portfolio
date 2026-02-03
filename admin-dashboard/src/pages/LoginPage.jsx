import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking...');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check API connectivity on mount
  useEffect(() => {
    checkAPI();
  }, []);

  const checkAPI = async () => {
    try {
      const response = await fetch('https://makeplus-portfolio-backend.vercel.app/api/health');
      const data = await response.json();
      if (data.status === 'healthy') {
        setApiStatus('✅ Connected');
      } else {
        setApiStatus('⚠️ API Issue');
      }
    } catch (err) {
      console.error('API check failed:', err);
      setApiStatus('❌ Cannot reach API');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login form submitted with:', { email, password: '***' });

    const result = await login(email, password);
    
    console.log('Login result:', result);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>Makeplus</h1>
          <p style={styles.subtitle}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@makeplus.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Default credentials: elaziziabdeldjalil@gmail.com / Admin123!Change
          </p>
          <p style={styles.footerText}>
            Backend API: {apiStatus}
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    padding: '20px',
  },
  loginBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '48px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    fontSize: '36px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #872c7a, #b83db8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
  },
  input: {
    padding: '14px 16px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    outline: 'none',
    color: 'white',
    transition: 'all 0.2s',
  },
  button: {
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #872c7a, #b83db8)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: '8px',
    boxShadow: '0 4px 15px rgba(135, 44, 122, 0.4)',
  },
  error: {
    padding: '14px',
    background: 'rgba(244, 67, 54, 0.2)',
    border: '1px solid rgba(244, 67, 54, 0.5)',
    color: '#ff6b6b',
    borderRadius: '12px',
    fontSize: '14px',
    textAlign: 'center',
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  footerText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    margin: '8px 0',
  },
};
