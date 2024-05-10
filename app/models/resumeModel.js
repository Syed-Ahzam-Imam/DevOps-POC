'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');

const Resume = db.define('Resume', {
  resumeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  resumeDetails: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pdf: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'resume'
});

module.exports = Resume;
