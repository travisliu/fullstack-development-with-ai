// src/services/segmentService.js

const { Segment, FeatureFlag, Sequelize } = require('../models');

const segmentService = {
  createSegment: async (data) => {
    const { name, description, criteria } = data;
    return await Segment.create({
      name,
      description,
      criteria
    });
  },

  getAllSegments: async (page = 0, limit = 10, query = '') => {
    let offset = null;
    // const offset = (page - 1) * limit;
    let where = {};

    if (query) {
      where = {
        name: {
          [Sequelize.Op.like]: `%${query}%`
        }
      };
    }

    if(page !== 0){
      offset = (page - 1) * limit;
    }

    const { count, rows } = await Segment.findAndCountAll({
      where,
      include: [{
        model: FeatureFlag,
        as: 'featureFlags', // Make sure this matches your association alias
        through: { attributes: [] } // Exclude join table attributes
      }],
      limit,
      offset,
      order: [['id', 'DESC']] // Example ordering, adjust as necessary
    });

    const total = page === 0 ? null : Math.ceil(count / limit);
    return {
      segments: rows,
      total,
      page,
      limit,
    };
  },

  getSegmentById: async (id) => {
    return await Segment.findByPk(id, {
      include: ['featureFlags']
    });
  },

  updateSegment: async (id, data) => {
    const segment = await Segment.findByPk(id);
    if (!segment) {
      throw new Error('Segment not found');
    }

    const { name, description, criteria } = data;
    await segment.update({
      name,
      description,
      criteria
    });

    return segment;
  },

  deleteSegment: async (id) => {
    const segment = await Segment.findByPk(id);
    if (!segment) {
      throw new Error('Segment not found');
    }
    await segment.destroy();
  }
};

module.exports = segmentService;
