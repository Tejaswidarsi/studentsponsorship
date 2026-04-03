const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});

const upload = multer({ storage: storage });

if (!fs.existsSync('Uploads')) {
  fs.mkdirSync('Uploads');
}

router.post('/apply', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'incomeProof', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;
    const duplicate = await Student.findOne({
      email: data.email,
      educationLevel: data.educationLevel,
      institutionName: data.institutionName,
      currentClassOrProgram: data.currentClassOrProgram
    });

    if (duplicate) {
      return res.status(409).json({
        message: 'You have already submitted an application for this education level and institution.'
      });
    }

    const student = new Student({
      ...data,
      photoUrl: req.files['photo']?.[0].filename || '',
      incomeProofUrl: req.files['incomeProof']?.[0].filename || '',
      videoUrl: req.files['video']?.[0].filename || ''
    });

    await student.save();
    res.status(201).json({ message: 'Application submitted successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/status?email=user@example.com
router.get('/status', async (req, res) => {
  try {
    const { email } = req.query; // Extract email from the URL query string

    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }

    console.log(`Searching database for requests from: ${email}`);

    // This line filters MongoDB to find ONLY the documents matching this email
    const studentRequests = await Student.find({ email: email });

    // Return the specific requests (or an empty array [] if none exist)
    res.status(200).json(studentRequests);
    
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a single request by its ID (for the Track Status page)
router.get('/status/request/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Find the specific application by its MongoDB _id
    const request = await Student.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(request);
  } catch (err) {
    console.error("Error fetching request by ID:", err);
    // If the ID is not a valid MongoDB ObjectId, it throws a CastError
    res.status(500).json({ error: "Invalid Request ID or Server Error" });
  }
});


// PUT /api/sponsor/student/:id/pay



module.exports = router;
