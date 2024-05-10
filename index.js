'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

//Routes
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const attendanceRoutes = require('./app/routes/attendanceRoutes');
const resumeRoutes = require('./app/routes/resumeRoutes');
const { connectToDatabase } = require('./config/mongodbConfig');



const logRequests = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
};


const app = express();
const corsOptions = {
  origin: [process.env.URL_FRONTEND, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Set the correct origin of your frontend
  credentials: true,
};

app.use(logRequests);

app.use(cors(corsOptions));
app.use(express.json());


// Serve static files from the 'uploads' directory
app.use('/uploads/stamp', express.static(path.join(__dirname, 'uploads', 'stamp')));
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads', 'profile')));

// Set up routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/resume', resumeRoutes);


connectToDatabase().catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
});

const PORT_BACKEND = process.env.PORT_BACKEND;
app.listen(PORT_BACKEND, () => {
  console.log(`Server is running on ${process.env.URL_BACKEND}`);
  console.log(`Database Name: SecureHr`);

});