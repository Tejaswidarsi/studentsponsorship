import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './sponsor.css';
import logoutIcon from '../images/logout.png';
function SponsorDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [paymentInputs, setPaymentInputs] = useState({});
  const [sponsorEmail, setSponsorEmail] = useState('test@example.com');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const razorpayid = "rzp_test_SZKIeUtSVH1qt4";
  // Fetch student data
  const API_BASE_URL = "https://studentsponsorship.onrender.com/api/sponsor";
  const UPLOAD_BASE_URL = "https://studentsponsorship.onrender.com/uploads";
// Example call:
  
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      alert('Failed to load student data');
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Payment Handler
  const handlePayment = async (student) => {
    const amount = parseFloat(paymentInputs[student._id]);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!razorpayLoaded && !(await loadRazorpayScript())) {
      alert('Razorpay SDK failed to load');
      return;
    }

    try {
      const response = await axios.post(
  `${API_BASE_URL}/create-order`,
  { amount }
);
console.log("Backend Response:", response.data);

if (!response.data || !response.data.id) {
  alert("Order creation failed");
  return;
}

const orderId = response.data.id;
const currency = response.data.currency;
const razorpay_amount = response.data.amount;



      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || razorpayid,
        amount: razorpay_amount,
        currency,
        name: 'EduBond',
        description: `Sponsoring ${student.name}`,
        order_id: orderId,
        handler: async function (response) {
  console.log("RAZORPAY RESPONSE:", response);

  const dataToSend = {
    studentId: student._id,
    transactionId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
    signature: response.razorpay_signature,
    amount: amount,
  };

  console.log("SENDING DATA:", dataToSend);

  try {
    await axios.post(
      `${API_BASE_URL}/payment-success`,
      dataToSend
    );

    alert("Payment successful!");
  } catch (err) {
    console.error("Error recording payment:", err);
  }
},
        prefill: {
          email: sponsorEmail,
          contact: '9441766348',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to create payment order');
    }
  };
 const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sponsorEmail');
    
    navigate('/sponsor-login');
  };
  return (
    <div className="sponsor-dashboard">
      <button onClick={handleLogout} className="logout-icon-button" title="Logout">
                  <img src={logoutIcon} alt="Logout" />
              </button>

      <div className="sponsor-container">
        <h2 className="sponsor-header">EduBond Sponsor Dashboard</h2>

        {students.length === 0 ? (
          <p className="no-students-message">
            <i className="fas fa-check-circle me-2 text-secondary"></i>
            No students currently need funding 🎉
          </p>
        ) : (
          students.map((student) => (
            <div key={student._id} className="student-profile-card">
              <div className="student-profile-content">
                <img
                  src={`${UPLOAD_BASE_URL}/${student.photoUrl}`}
                  alt={`${student.name}`}
                  className="student-profile-image"
                  onError={(e) => {
                    e.target.src = 'default-image.jpg';
                  }}
                />
                <div className="student-info-section">
                  <h3 className="student-name">{student.name}</h3>
                  <p><i className="fas fa-graduation-cap me-2 text-secondary"></i>{student.educationLevel} - {student.currentClassOrProgram}</p>
                  <p><i className="fas fa-university me-2 text-secondary"></i>{student.institutionName}</p>
                  <p className="student-story">{student.story}</p>
                  <div className="student-video-section">
                    <video
                      controls
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ maxWidth: '100%', marginTop: '5px' }}
                    >
                      <source src={`${UPLOAD_BASE_URL}/${student.videoUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="funding-details">
                    <p><strong>Required:</strong> ₹{student.requiredAmount}</p>
                    <p><strong>Received:</strong> ₹{student.received}</p>
                    <p><strong>Remaining:</strong> ₹{student.requiredAmount - student.received}</p>
                  </div>
                  <div className="payment-section">
                    <input
                      type="number"
                      placeholder="Enter amount to pay"
                      min="1"
                      value={paymentInputs[student._id] || ''}
                      onChange={(e) =>
                        setPaymentInputs({ ...paymentInputs, [student._id]: e.target.value })
                      }
                      className="payment-input-field"
                    />
                    <button
                      onClick={() => handlePayment(student)}
                      className="payment-submit-button"
                    >
                      <i className="fas fa-money-check-alt"></i> Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="footer">
        <p>
          Contact: <a href="mailto:tejaswi_darsi@srmap.edu.in">tejaswi_darsi@srmap.edu.in</a> | +91 94417 66348
        </p>
      </footer>
    </div>
  );
}

export default SponsorDashboard;
