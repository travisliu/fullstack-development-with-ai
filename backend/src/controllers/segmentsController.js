// src/controllers/segmentsController.js

const segmentService = require('../services/segmentService');
const { presentSegment, presentSegments } = require('../presenters/segmentPresenter');

const segmentsController = {
  create: async (req, res, next) => {
    try {
      const segment = await segmentService.createSegment(req.body);
      res.status(201).json(presentSegment(segment));
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page || 1);
      const limit = parseInt(req.query.limit || 10);
      const query = req.query.query || '';

      const { segments, total } = await segmentService.getAllSegments(page, limit, query);
      res.status(200).json(presentSegments(segments, total, page, limit));
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const segment = await segmentService.getSegmentById(req.params.id);
      if (!segment) {
        return res.status(404).json({ message: 'Segment not found' });
      }
      res.status(200).json(presentSegment(segment));
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const updatedSegment = await segmentService.updateSegment(req.params.id, req.body);
      res.status(200).json(presentSegment(updatedSegment));
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await segmentService.deleteSegment(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = segmentsController;
