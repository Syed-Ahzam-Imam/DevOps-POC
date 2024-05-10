'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');



// Get all user
router.get('/', userController.getAllUsers);

// Get a specific user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

// Add a profile picture for a user by ID
router.post('/:id/profile-picture', userController.uploadProfilePictureUser);

module.exports = router;
