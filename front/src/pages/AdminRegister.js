import React, { useState } from 'react';
import API from '../api';
import { useNavigate,Link } from 'react-router-dom';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await API.post('/admin/register', {
        email,
        password
      });
      
      setMessage(res.data.message);
      setTimeout(() => navigate('/admin-login'), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Registration failed');
      }
    }
  };

  return (
    <>
    <div style={{ padding: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#2563eb' }}>
          ← Back to Home Page
        </Link>
      </div>
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Admin Register</h2>

        {message && <p style={styles.message}>{message}</p>}

        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          style={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>
      
      <p className="register-footer">
    Already have an account?{' '}
    <span
  onClick={() => navigate('/admin-login')}
  style={styles.loginLink}
  onMouseOver={(e) => e.target.style.color = '#1e40af'}
  onMouseOut={(e) => e.target.style.color = '#2563eb'}
>
  Login
</span>
  </p>
  </div>
    </div>
    </>
  );
};

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '350px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  heading: {
    marginBottom: '20px',
    color: '#333'
  },
  message: {
    color: 'red',
    marginBottom: '10px'
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    transition: '0.3s',
  },
  button: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
  }
};

export default AdminRegister;