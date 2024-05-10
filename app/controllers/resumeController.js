'use strict';

const Resume = require('../models/resumeModel');
const fs = require('fs');
const path = require('path');

class ResumeController {
  static async uploadResume(req, res) {
    try {
      const { resumeDetails } = req.body;
      const pdf = req.file ? req.file.path : null;

      const resume = await Resume.create({ resumeDetails, pdf });

      return res.status(201).json({ success: true, message: 'Resume uploaded successfully', resume });
    } catch (error) {
      console.error('Error uploading resume:', error);
      return res.status(500).json({ success: false, message: 'Failed to upload resume', error: error.message });
    }
  }

  static async getAllResumes(req, res) {
    try {
      const resumes = await Resume.findAll();

      return res.status(200).json({ success: true, resumes });
    } catch (error) {
      console.error('Error retrieving resumes:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve resumes', error: error.message });
    }
  }

  static async deleteResume(req, res) {
    try {
      const { resumeId } = req.params;

      const resume = await Resume.findByPk(resumeId);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      // Delete the associated PDF file
      if (resume.pdf) {
        fs.unlinkSync(path.join(__dirname, '..', '..', resume.pdf));
      }

      await resume.destroy();

      return res.status(200).json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
      console.error('Error deleting resume:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete resume', error: error.message });
    }
  }
}

module.exports = ResumeController;
