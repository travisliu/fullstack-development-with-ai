// src/services/featureFlagService.js
const { FeatureFlag, Segment, sequelize, Sequelize } = require('../models');

const featureFlagService = {
  createFeatureFlag: async (data) => {
    const { name, enabled, type, segments: segmentIds } = data;
    const transaction = await sequelize.transaction();

    try {
      const featureFlag = await FeatureFlag.create({ name, enabled, type }, { transaction });
  
      console.log('=== service segmentIds', { segmentIds })
      if (segmentIds && segmentIds.length > 0) {
        const segments = await Segment.findAll({ where: { id: segmentIds } });
        await featureFlag.setSegments(segments, { transaction });
        console.log('=== service create:', { segments, featureFlag: featureFlag.segements })
      }
  
      await transaction.commit();

      return await featureFlag.reload({
				include: ['segments']
      });
    } catch (error) {
      console.log('=== service create error', error)
      await transaction.rollback();
      throw error;
    }
  },

  getAllFeatureFlags: async (page = 0, limit = 10, query = '') => {
    let offset = null;
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
    
    const { count, rows } = await FeatureFlag.findAndCountAll({
      include: [{
        model: Segment,
        as: 'segments', // Make sure this matches your association alias
        through: { attributes: [] } // Exclude join table attributes
      }],
      where, 
      limit,
      offset,
      order: [['id', 'DESC']] // Example ordering, adjust as necessary
    });

    // console.log('=== get all featureflags:')
    
    const total = page === 0 ? null : Math.ceil(count / limit);
    return {
      featureFlags: rows,
      total,
      page,
      limit,
    };
  },

  getFeatureFlagById: async (id) => {
    return await FeatureFlag.findByPk(id, {
      include: ['segments']
    });
  },

  updateFeatureFlag: async (id, data) => {
    const { name, enabled, type, segments: segmentIds } = data;
    const featureFlag = await FeatureFlag.findByPk(id, {
      include: ['segments']
    });

    if (!featureFlag) {
      throw new Error('FeatureFlag not found');
    }

    await featureFlag.update({ name, enabled, type });

    if (!segmentIds) { return featureFlag; }

    await featureFlag.setSegments(segmentIds);
    return await featureFlag.reload({
      include: ['segments']
    });
  },

  deleteFeatureFlag: async (id) => {
    const featureFlag = await FeatureFlag.findByPk(id);
    if (!featureFlag) {
      throw new Error('FeatureFlag not found');
    }
    await featureFlag.destroy();
  },

  associateSegments: async (featureFlagId, segmentIds) => {
    const featureFlag = await FeatureFlag.findByPk(featureFlagId);
    if (!featureFlag) {
      throw new Error('Feature flag not found');
    }

    const segments = await Segment.findAll({
      where: { id: segmentIds }
    });

    if (segments.length !== segmentIds.length) {
      throw new Error('One or more segments not found');
    }

    await featureFlag.setSegments(segments);
    return featureFlag; // Optionally, include logic to return the updated feature flag with associated segments
  },

  getAssociatedSegments: async (featureFlagId) => {
    const featureFlag = await FeatureFlag.findByPk(featureFlagId, {
      include: [{
        model: Segment,
        as: 'segments', // Ensure this matches the alias used in your association definition
        through: { attributes: [] } // Exclude attributes from the join table
      }]
    });

    if (!featureFlag) {
      throw new Error('Feature flag not found');
    }

    return featureFlag.segments;
  },

  removeAssociation: async (featureFlagId, segmentId) => {
    const featureFlag = await FeatureFlag.findByPk(featureFlagId);
    if (!featureFlag) {
      throw new Error('Feature flag not found');
    }

    const segment = await Segment.findByPk(segmentId);
    if (!segment) {
      throw new Error('Segment not found');
    }

    // throw an error if the association does not exist
    const association = await featureFlag.hasSegment(segment);
    if (!association) {
      throw new Error('Association does not exist');
    }

    await featureFlag.removeSegment(segment);
  },
};

module.exports = featureFlagService;
