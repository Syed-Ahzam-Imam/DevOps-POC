'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Multer file filter configuration
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

// Multer upload configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Upload a resume (PDF and details)
router.post('/', upload.single('pdf'), resumeController.uploadResume);

// Get all resumes
router.get('/', resumeController.getAllResumes);

// Delete a resume by ID
router.delete('/:resumeId', resumeController.deleteResume);

module.exports = router;
