'use strict';

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Create new attendance record
router.post('/:userId', attendanceController.createAttendance);

// Update existing attendance record
router.put('/:attendanceId', attendanceController.updateAttendance);

// Delete attendance record by ID
router.delete('/:attendanceId', attendanceController.deleteAttendance);

router.get('/', attendanceController.getAllAttendance);

// Get attendance records by user ID
router.get('/:userId', attendanceController.getAttendanceByUserId);

module.exports = router;
