import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/admin/login', { email, password });
      localStorage.setItem('adminLoggedIn', true);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin-dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <>
      {/* Internal CSS */}
      <style>{`
        .admin-login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 85vh;
          background-color: #f0f2f5;
          font-family: 'Segoe UI', Roboto, sans-serif;
        }
        .login-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }
        .login-card h2 {
          margin-top: 0;
          color: #1a1a1a;
          font-size: 24px;
          margin-bottom: 25px;
        }
        .input-group {
          margin-bottom: 15px;
        }
        .login-card input {
          width: 100%;
          padding: 12px;
          border: 1px solid #dcdfe6;
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .login-card input:focus {
          border-color: #409eff;
          outline: none;
        }
        .login-btn {
          width: 100%;
          padding: 12px;
          background-color: #409eff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.3s;
        }
        .login-btn:hover {
          background-color: #66b1ff;
        }
        .register-footer {
          margin-top: 20px;
          font-size: 14px;
          color: #606266;
        }
        .register-link {
          color: #409eff;
          text-decoration: none;
          font-weight: 500;
        }
        .register-link:hover {
          text-decoration: underline;
        }
        
      `}</style>

       
      <div className="admin-login-page">
        
        <div className="login-card">
          <h2>Admin Login</h2>
          
          <div className="input-group">
            <input 
              type="email"
              placeholder="Admin Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
          
          <div className="register-footer">
            Don't have an account?{' '}
            <Link to="/admin-register" className="register-link">
              Admin Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;