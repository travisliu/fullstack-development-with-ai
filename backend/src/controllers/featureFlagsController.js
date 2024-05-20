// src/controllers/featureFlagsController.js

const featureFlagService = require('../services/featureFlagService');
const { presentFeatureFlag, presentFeatureFlags, presenterAssociatedSegments } = require('../presenters/featureFlagPresenter');
const { presentSegments } = require('../presenters/segmentPresenter');

const featureFlagsController = {
  create: async (req, res, next) => {
    try {
      const featureFlag = await featureFlagService.createFeatureFlag(req.body);
      res.status(201).json(presentFeatureFlag(featureFlag));
    } catch (error) {
      next(error); // Pass errors to Express error handling middleware
    }
  },

  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page || 1);
      const limit = parseInt(req.query.limit || 10);
      const query = req.query.query || '';
      const { featureFlags, total } = await featureFlagService.getAllFeatureFlags(page, limit, query);
      res.status(200).json(presentFeatureFlags(featureFlags, total, page, limit));
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const featureFlag = await featureFlagService.getFeatureFlagById(req.params.id);
      if (!featureFlag) {
        return res.status(404).json({ message: 'Feature flag not found' });
      }
      res.status(200).json(presentFeatureFlag(featureFlag));
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const updatedFeatureFlag = await featureFlagService.updateFeatureFlag(req.params.id, req.body);
      res.status(200).json(presentFeatureFlag(updatedFeatureFlag));
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await featureFlagService.deleteFeatureFlag(req.params.id);
      res.status(204).json({ id: req.params.id });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = featureFlagsController;
