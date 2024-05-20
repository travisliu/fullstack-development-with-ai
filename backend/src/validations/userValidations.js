const { body } = require('express-validator');

const createUserValidations = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'user']).withMessage('Role must be either "admin" or "user"')
];

// add a validation for update
const updateUserValidations = [
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'user']).withMessage('Role must be either "admin" or "user"')
];

module.exports = {
  createUserValidations,
  updateUserValidations
};
