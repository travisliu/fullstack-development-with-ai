const { Factory } = require('fishery');
const { faker } = require('@faker-js/faker');
const FeatureFlag = require('../../src/models').FeatureFlag;
const segmentFactory = require('./segment');

class FeatureFlagFactory extends Factory {
  enabled() {
    return this.params({ enabled: true });
  }

  disabled() {
    return this.params({ enabled: false });
  }

  async withSegments() {
    const segments = await segmentFactory.createList(faker.number.int({ min: 1, max: 10 }));
    return this.associations({ segments });
  }
}

const featureFlagFactory = FeatureFlagFactory.define(async ({ sequence, params, onCreate, associations }) => {
  onCreate(async (featureFlag) => {
    const newFeatureFlag = await FeatureFlag.create(await featureFlag, { logging: false })
    if (featureFlag.segments?.length > 0) {
      await newFeatureFlag.setSegments(featureFlag.segments);
    }

    return newFeatureFlag;
  });

  return {
    id: sequence,
    name: params.name || faker.word.words(),
    enabled: params.enabled || faker.datatype.boolean(),
    type: params.type || faker.helpers.arrayElement(['release', 'experimental', 'operational']),
    segments: associations.segments || []
  };
});

module.exports = featureFlagFactory;
