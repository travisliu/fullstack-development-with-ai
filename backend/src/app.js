// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const morgan = require('morgan')

require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const featureFlagRoutes = require('./routes/featureFlagsRoutes');
const segmentRoutes = require('./routes/segmentsRoutes');

// Import middleware
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// app.use(morgan('combined'))

// Initialize Passport
app.use(passport.initialize());

// Import Passport configurations
require('./config/passport');

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/feature-flags', featureFlagRoutes);
app.use('/api/v1/segments', segmentRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;
