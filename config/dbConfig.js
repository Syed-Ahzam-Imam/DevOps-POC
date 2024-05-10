'use strict';

const { Sequelize } = require('sequelize');
const winston = require('winston');
const fs = require('fs');
require('dotenv').config();

const logFileName = 'sequelize.log';

// Create the log file if it doesn't exist
if (!fs.existsSync(logFileName)) {
  fs.writeFileSync(logFileName, '', 'utf-8');
}

// Create a logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: logFileName })
  ]
});

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: (msg) => logger.info(msg)
  // logging: console.log
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    // await sequelize.sync({ alter: true });
    console.log('Tables available successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
})();

module.exports = sequelize;
