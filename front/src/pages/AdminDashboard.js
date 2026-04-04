import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './studentdashboard.css'; 
import logoutIcon from '../images/logout.png';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchAllRequests = async () => {
    try {
      const res = await API.get('/admin/all-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    const interval = setInterval(fetchAllRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const approveRequest = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      fetchAllRequests();
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await API.put(`/admin/reject/${id}`);
      fetchAllRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div className="dashboard-wrapper">
      {/* HEADER SECTION: Pushes title left and logout right */}
      <header className="dashboard-header">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-icon-button" title="Logout">
          <img src={logoutIcon} alt="Logout" className="logout-img" />
        </button>
      </header>

      {/* REQUESTS SECTION */}
      <div className="requests-container">
        {requests.map((req) => (
          <div key={req._id} className="admin-request-card">
            <div className="card-top-section">
              {req.photoFullPath && (
                <img src={req.photoFullPath} alt="Student" className="admin-student-photo" />
              )}
              <div className="admin-student-meta">
                <h4>{req.name}</h4>
                <p><strong>Email:</strong> {req.email}</p>
                <p><strong>Program:</strong> {req.currentClassOrProgram}</p>
              </div>
            </div>

            <div className="card-details">
              <p><strong>Education:</strong> {req.educationLevel}</p>
              <p><strong>Institution:</strong> {req.institutionName}</p>
              <p><strong>Purpose:</strong> {req.story?.slice(0, 60)}...</p>
              <p><strong>Required:</strong> ₹{req.requiredAmount}</p>
            </div>

            <div className="status-badge">
              <strong>Status:</strong>{' '}
              <span className={`status-text ${req.statusProgress.toLowerCase()}`}>
                {req.statusProgress}
              </span>
            </div>

            <div className="document-section">
              <strong>Income Proof:</strong>
              {req.incomeProofFullPath ? (
                <a href={req.incomeProofFullPath} target="_blank" rel="noopener noreferrer" className="view-doc-link">
                  View Document
                </a>
              ) : (
                <span className="no-doc-text">No document uploaded</span>
              )}
            </div>

            <div className="admin-actions">
              <button
                onClick={() => approveRequest(req._id)}
                disabled={['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress)}
                className="btn-approve"
              >
                {req.statusProgress === 'Approved' ? 'Approved' : 'Approve'}
              </button>
              <button
                onClick={() => rejectRequest(req._id)}
                disabled={['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress)}
                className="btn-reject"
              >
                {req.statusProgress === 'Rejected' ? 'Rejected' : 'Reject'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;