// src/validators/featureFlagValidator.js
const { body, query } = require('express-validator');

const createUpdateFeatureFlagValidator = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name must not be empty.'),
  body('enabled')
    .isBoolean()
    .withMessage('Enabled must be a boolean value.'),
  body('type')
    .isIn(['release', 'experimental', 'operational'])
    .withMessage('Type must be one of the following values: release, experimental, operational.'),
  body('segments')
    .optional()
    .isArray()
    .withMessage('Segments must be an array of segment IDs.')
    .custom((value) => value.every((id) => Number.isInteger(id)))
    .withMessage('Each segment ID must be an integer.'),
];

const updateFeatureFlagValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name, if provided, must not be empty.')
    .isAlphanumeric('en-US', { ignore: ' -_' })
    .withMessage('Name must only contain letters, numbers, spaces, hyphens, or underscores.'),
  body('enabled')
    .optional()
    .isBoolean()
    .withMessage('Enabled, if provided, must be a boolean value.'),
  body('type')
    .optional()
    .isIn(['release', 'experimental', 'operational'])
    .withMessage('Type, if provided, must be one of the following values: release, experimental, operational.'),
  body('segments')
    .optional()
    .isArray()
    .withMessage('Segments, if provided, must be an array of segment IDs.')
    .custom((value) => value.every((id) => Number.isInteger(id)))
    .withMessage('Each segment ID, if provided, must be an integer.'),
];

const associateSegmentsValidator = [
  body('segmentIds')
    .isArray()
    .withMessage('Segments must be an array of segment IDs.')
    .custom((value) => value.every((id) => Number.isInteger(id)))
    .withMessage('Each segment ID must be an integer.'),
]; 

const getAllFeatureFlagsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page, if provided, must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Limit, if provided, must be a positive integer.'),
  query('query')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Query must not be empty.')
];

module.exports = {
  createUpdateFeatureFlagValidator,
  updateFeatureFlagValidator,
  getAllFeatureFlagsValidator,
  associateSegmentsValidator,
};
