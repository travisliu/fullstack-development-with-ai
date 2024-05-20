// src/validators/segmentValidator.js

const { body, query } = require('express-validator');

const createUpdateSegmentValidator = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name must not be empty.')
    .matches(/^[a-zA-Z0-9 _-]+$/)
    .withMessage('Name must only contain letters, numbers, spaces, hyphens, or underscores.'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description, if provided, must not be empty.'),
  body('criteria')
    .exists({ checkFalsy: true })
    .withMessage('Criteria is required.')
    .isArray({ min: 1 })
    .withMessage('Criteria must be a non-empty array.')
    .custom((criteria) => criteria.every(c => typeof c.attribute === 'string' && c.attribute.length > 0))
    .withMessage('Each criteria must have a valid "attribute" field.')
    .custom((criteria) => criteria.every(c => ['equals', 'greater_than', 'less_than', 'contains'].includes(c.operator)))
    .withMessage('Each criteria must have a valid "operator".')
    .custom((criteria) => criteria.every(c => 'value' in c))
    .withMessage('Each criteria must include a "value".'),
];

// add more validators for numerical page and limit for pagination
const getAllSegmentsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer.'),
  query('query')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Query must not be empty.'),
];

module.exports = {
  createUpdateSegmentValidator,
  getAllSegmentsValidator
};
