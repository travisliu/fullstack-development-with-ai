// src/storage/index.js

const LocalStorageManager = require('./LocalStorageManager');
const FeatureFlagStore = require('./FeatureFlagStore');
const SegmentStore = require('./SegmentStore');

module.exports = {
  LocalStorageManager,
  FeatureFlagStore,
  SegmentStore,
};
