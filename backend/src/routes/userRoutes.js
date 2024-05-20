const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validatorMiddleware');
const { createUserValidations, updateUserValidations } = require('../validations/userValidations');

// List all users
router.get('/', authenticate, authorize(['admin']), usersController.listAllUsers);

// Get a specific user
router.get('/:userId', authenticate, authorize(['admin']), usersController.getUser);

// Create a new user
router.post('/', authenticate, validate(createUserValidations), authorize(['admin']), usersController.createUser);

// Update an existing user
router.put('/:userId', authenticate, validate(updateUserValidations), authorize(['admin']), usersController.updateUser);

// Delete a user
router.delete('/:userId', authenticate, authorize(['admin']), usersController.deleteUser);

module.exports = router;
