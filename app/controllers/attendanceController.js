'use strict';

const { error } = require('winston');
const Attendance = require('../models/attendanceModel');
const User = require('../models/userModel');

class AttendanceController {

  static async getAllAttendance(req, res) {
    try {
      const allAttendance = await Attendance.findAll({
        include: [{ model: User }],
      });
      return res.status(200).json({ success: true, attendance: allAttendance });
    } catch (error) {
      console.error("Error retrieving all attendance:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve all attendance",
        error: error.message,
      });
    }
  }

  static async getAttendanceByUserId(req, res) {
    try {
      const userId = req.params.userId; // Assuming the user ID is passed as a route parameter
      const userAttendance = await Attendance.findAll({
        where: { userId },
        include: [{ model: User }],
      });
      return res
        .status(200)
        .json({ success: true, attendance: userAttendance });
    } catch (error) {
      console.error("Error retrieving attendance by user ID:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve attendance by user ID",
        error: error.message,
      });
    }
  }
  static async createAttendance(req, res) {
    try {
      const userId = req.params.userId;
      console.log("UserId", userId)
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Get current date
      const currentDate = new Date().toISOString().split('T')[0];

      // Check if the user has already clocked in for the current date
      const existingAttendance = await Attendance.findOne({
        where: {
          userId,
          date: currentDate
        }
      });

      if (existingAttendance) {
        return res.status(400).json({ success: false, message: 'Attendance already recorded for today' });
      }

      // Store arrival time
      const arrivalTime = new Date().toISOString().split('T')[1].substring(0, 8);

      // Create new attendance record
      const attendance = await Attendance.create({
        userId,
        date: currentDate,
        attendanceVisual: 'Present', // Default to Present
        arrivalTime
      });

      return res.status(201).json({ success: true, message: 'Attendance created successfully', attendance });
    } catch (error) {
      console.error('Error creating attendance:', error);
      return res.status(500).json({ success: false, message: 'Failed to create attendance', error: error.message });
    }
  }

  static async updateAttendance(req, res) {
    try {
      const attendanceId = req.params.attendanceId;
      console.log("attendanceId", attendanceId)
      const departureTime = new Date().toISOString().split('T')[1].substring(0, 8);
      // Calculate effective hours based on arrival and departure times
      const attendance = await Attendance.findByPk(attendanceId);
      if (!attendance) {
        // Handle case where attendance record with given ID is not found
        return res.status(404).json({ success: false, message: 'Attendance record not found' });
      }

      const arrivalTime = attendance.arrivalTime;

      if (arrivalTime) {
        const arrivalHour = parseInt(arrivalTime.split(':')[0]);
        const arrivalMinute = parseInt(arrivalTime.split(':')[1]);
        const arrivalSecond = parseInt(arrivalTime.split(':')[2]);
        const departureHour = parseInt(departureTime.split(':')[0]);
        const departureMinute = parseInt(departureTime.split(':')[1]);
        const departureSecond = parseInt(departureTime.split(':')[2]);
        const effectiveHours = (departureHour + departureMinute / 60 + departureSecond / 3600) - (arrivalHour + arrivalMinute / 60 + arrivalSecond / 3600);

        // Update attendance record with departure time and effective hours
        await Attendance.update({ departureTime, effectiveHrs: effectiveHours }, { where: { attendanceId } });

        // Calculate attendance percentage
        const totalHoursAttended = await Attendance.sum('effectiveHrs', {
          where: {
            userId: attendance.userId,
            date: {
              [Op.gte]: moment().startOf('isoWeek').toDate(),
              [Op.lte]: moment().endOf('isoWeek').toDate()
            }
          }
        });

        const attendancePercentage = (totalHoursAttended / 40) * 100;

        // Update attendance record with attendance visual (percentage)
        await Attendance.update({ attendanceVisual: attendancePercentage }, { where: { attendanceId } });

        return res.status(200).json({ success: true, message: 'Attendance updated successfully' });
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      return res.status(500).json({ success: false, message: 'Failed to update attendance', error: error.message });
    }
  }
  static async deleteAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const attendance = await Attendance.findByPk(attendanceId);

      if (!attendance) {
        return res.status(404).json({ success: false, message: 'Attendance not found' });
      }

      await attendance.destroy();

      return res.status(200).json({ success: true, message: 'Attendance deleted successfully' });
    } catch (error) {
      console.error('Error deleting attendance:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete attendance', error: error.message });
    }
  }
}

module.exports = AttendanceController;
