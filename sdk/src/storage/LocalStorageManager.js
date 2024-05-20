// src/storage/LocalStorageManager.js

class LocalStorageManager {
  constructor() {
    this.featureFlags = new Map(); // Simulates storage for feature flags
    this.segments = new Map(); // Simulates storage for segments
  }

  // Sets the initial state of all feature flags
  setAllFeatureFlags(featureFlags) {
    this.featureFlags.clear();
    featureFlags.forEach(flag => {
      this.featureFlags.set(flag.id, flag);
    });
  }

  // Sets the initial state of all segments
  setAllSegments(segments) {
    this.segments.clear();
    segments.forEach(segment => {
      this.segments.set(segment.id, segment);
    });
  }

  // Updates an existing feature flag or adds it if it doesn't exist
  upsertFeatureFlag(featureFlag) {
    this.featureFlags.set(featureFlag.id, featureFlag);
  }

  // Updates an existing segment or adds it if it doesn't exist
  upsertSegment(segment) {
    this.segments.set(segment['id'], segment);
  }

  // Deletes a feature flag by ID
  deleteFeatureFlag(id) {
    this.featureFlags.delete(id);
  }

  // Deletes a segment by ID
  deleteSegment(id) {
    this.segments.delete(id);
  }

  // Retrieves a feature flag by name
  getFeatureFlag(name) {
    for (let flag of this.featureFlags.values()) {
      if (flag.name === name) return flag;
    }
    return null;
  }

  // Returns a map of segmentId to segment for easy lookup
  getSegmentsMap() {
    return new Map(this.segments);
  }
}

module.exports = LocalStorageManager;
