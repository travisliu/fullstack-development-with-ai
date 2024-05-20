// src/presenters/featureFlagPresenter.js

function presentFeatureFlag(featureFlag) {
  return {
      id: featureFlag.id,
      name: featureFlag.name,
      enabled: featureFlag.enabled,
      segments: featureFlag.segments?.map(segment => segment.id) || [],
      type: featureFlag.type,
      // Add any additional fields as needed
  };
}

function presentFeatureFlags(featureFlags, total, page, limit) {
  return {
      items: featureFlags.map(presentFeatureFlag),
      total,
      page,
      limit,
  };
}

async function presenterAssociatedSegments(featureFlag) {
  return {
    associatedSegments: (await featureFlag.getSegments()).map(segment => segment.id),
  }
}

module.exports = {
  presentFeatureFlag,
  presentFeatureFlags,
  presenterAssociatedSegments
};
