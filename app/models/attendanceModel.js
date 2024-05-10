'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const User = require('./userModel');

const Attendance = db.define('Attendance', {
  attendanceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  attendanceVisual: {
    type: DataTypes.STRING,
    allowNull: true
  },
  effectiveHrs: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  grossHrs: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  departureTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  arrivalTime: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false, 
  tableName: 'attendance' 
});

Attendance.belongsTo(User, { foreignKey: 'userId' });

module.exports = Attendance;
