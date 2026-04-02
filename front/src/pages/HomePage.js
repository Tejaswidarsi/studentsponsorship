import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to EduBond</h1>
      <p>Select your role</p>

      <div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  gap: '20px',   // 👈 this gives space between buttons
  marginTop: '20px'
}}>
  <button onClick={() => navigate('/register')} style={btnStyle}>Student Register</button>
  <button onClick={() => navigate('/admin-register')} style={btnStyle}>Admin Register</button>
  <button onClick={() => navigate('/sponsor-register')} style={btnStyle}>Sponsor Register</button>
</div>
    </div>
  );
};

const btnStyle = {
  padding: '15px 25px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: '#2563eb',
  color: 'white'
};

export default HomePage;