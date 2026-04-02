// AdminLogin.js
import  { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await API.post('/admin/login', { email, password });
      localStorage.setItem('adminLoggedIn', true);
      navigate('/admin-dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
