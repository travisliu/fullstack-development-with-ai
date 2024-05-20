// src/routes/segmentsRoutes.js

const express = require('express');
const router = express.Router();
const segmentsController = require('../controllers/segmentsController');
const { createUpdateSegmentValidator, getAllSegmentsValidator } = require('../validations/segmentValidator');
const { authenticate } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validatorMiddleware');

const decorateActions = require('../decorators/decorateActions');
const ActionObserver = require('../observers/actionObserver');
const BroadcastSubscriber = require('../observers/featureFlagsObserver/broadcastSubscriber')

const subscriber = new BroadcastSubscriber('Segment');
const observer = new ActionObserver();
observer.subscribe(subscriber);

decorateActions(
  segmentsController,
  observer,
  [
    'create',
    'update',
    'delete',
  ]
);

// Create a new segment
router.post('/', authenticate, validate(createUpdateSegmentValidator), segmentsController.create);

// Get all segments
router.get('/', authenticate, validate(getAllSegmentsValidator), segmentsController.getAll);

// Get a specific segment by ID
router.get('/:id', authenticate, segmentsController.getById);

// Update a segment by ID
router.put('/:id', authenticate, validate(createUpdateSegmentValidator), segmentsController.update);

// Delete a segment by ID
router.delete('/:id', authenticate, segmentsController.delete);

module.exports = router;
