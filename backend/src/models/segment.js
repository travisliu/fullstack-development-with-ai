'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Segment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.FeatureFlag, {
        through: 'FeatureFlagSegments',
        as: 'featureFlags',
        foreignKey: 'segmentId',
        otherKey: 'featureFlagId'
      });
      
    }
  }
  Segment.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true // Allowing description to be optional
    },
    criteria: {
      type: DataTypes.JSON,
      allowNull: false,
      // Validate criteria format if necessary, or handle in application logic
    }
  }, {
    sequelize,
    modelName: 'Segment',
  });
  return Segment;
};