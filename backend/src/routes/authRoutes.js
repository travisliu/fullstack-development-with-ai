// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for user login
router.post('/token', authController.token);

module.exports = router;
