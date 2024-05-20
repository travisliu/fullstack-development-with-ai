// src/storage/FeatureFlagStore.js

class FeatureFlagStore {
  constructor(localStorageManager) {
    this.localStorageManager = localStorageManager;
  }

  // Adds or updates a feature flag
  upsert(featureFlag) {
    this.localStorageManager.upsertFeatureFlag(featureFlag);
  }

  // Deletes a feature flag by its ID
  deleteById(id) {
    this.localStorageManager.deleteFeatureFlag(id);
  }

  // Retrieves a feature flag by name
  getByName(name) {
    return this.localStorageManager.getFeatureFlag(name);
  }

  // Sets the initial state of all feature flags (bulk operation)
  setAll(featureFlags) {
    this.localStorageManager.setAllFeatureFlags(featureFlags);
  }
}

module.exports = FeatureFlagStore;
