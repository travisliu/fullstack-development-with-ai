'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeatureFlag extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Segment, {
        through: 'FeatureFlagSegments',
        as: 'segments',
        foreignKey: 'featureFlagId',
        otherKey: 'segmentId'
      });
    }
  }
  FeatureFlag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    type: {
      type: DataTypes.ENUM('release', 'experimental', 'operational'),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'FeatureFlag',
  });
  return FeatureFlag;
};