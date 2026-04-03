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

router.get('/status/:email', async (req, res) => {
  console.log('Route hit with email:', req.params.email);
  try {
    const studentRequests = await Student.find({ email: req.params.email });
    if (!studentRequests || studentRequests.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(studentRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status/:email', async (req, res) => {
  try {
    const studentRequests = await Student.find({ email: req.params.email });
    // Send 200 even if empty, so the frontend doesn't crash
    res.status(200).json(studentRequests || []); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/sponsor/student/:id/pay



module.exports = router;
