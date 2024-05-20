// src/routes/featureFlagsRoutes.js

const express = require('express');
const router = express.Router();
const featureFlagsController = require('../controllers/featureFlagsController');
const { 
  createUpdateFeatureFlagValidator, 
  getAllFeatureFlagsValidator
} = require('../validations/featureFlagValidator');

const { authenticate } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validatorMiddleware');

const decorateActions = require('../decorators/decorateActions');
const ActionObserver = require('../observers/actionObserver');
const BroadcastSubscriber = require('../observers/featureFlagsObserver/broadcastSubscriber')

const subscriber = new BroadcastSubscriber('FeatureFlag');
const observer = new ActionObserver();
observer.subscribe(subscriber);

decorateActions(
  featureFlagsController,
  observer,
  [
    'create',
    'update',
    'delete',
  ]
);

router.post('/', authenticate, validate(createUpdateFeatureFlagValidator), featureFlagsController.create);
router.get('/', authenticate, validate(getAllFeatureFlagsValidator), featureFlagsController.getAll);
router.get('/:id', authenticate, featureFlagsController.getById);
router.put('/:id', authenticate, validate(createUpdateFeatureFlagValidator), featureFlagsController.update);
router.delete('/:id', authenticate, featureFlagsController.delete);

module.exports = router;
