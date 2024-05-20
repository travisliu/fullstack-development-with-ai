'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeatureFlagSegments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.FeatureFlag, { foreignKey: 'featureFlagId' });
      this.belongsTo(models.Segment, { foreignKey: 'segmentId' });
    }
  }
  FeatureFlagSegments.init({
    featureFlagId: DataTypes.INTEGER,
    segmentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FeatureFlagSegments',
  });
  return FeatureFlagSegments;
};