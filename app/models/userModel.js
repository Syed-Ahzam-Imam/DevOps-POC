'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig'); // Import your MySQL database configuration
//const User = require('./userModel');

const User = db.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      async isUniqueIfNotDeleted(value) {
        const existingUser = await User.findOne({
          where: {
            userName: value,
            isDeleted: false
          }
        });
        if (existingUser && existingUser.userId !== this.userId) {
          throw new Error('user name must be unique');
        }
      }
    }
  },
  fname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isPhoneNumber(value) {
        if (value && !/^[0-9]{11}$|^\+92[0-9]{10}$/.test(value)) {
          throw new Error(
            'Please provide a valid phone number or leave it empty.\nPhone number should be 11 digits without spaces or special characters, or 13 digits if starting with +.'
          );
        }
      }
    }
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['management', 'sales', 'development', 'hr']]
    }
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['admin', 'employee']]
    }
  },
  profilePicture: {
    type: DataTypes.STRING, // Assuming the profile picture is stored as a filename
    allowNull: true // Set to false if it's required
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: false, // Disable timestamps (createdAt, updatedAt)
  tableName: 'user' // Define the table name if it's different from the model name
});

module.exports = User;
