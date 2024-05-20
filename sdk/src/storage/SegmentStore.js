// src/storage/SegmentStore.js

class SegmentStore {
  constructor(localStorageManager) {
    this.localStorageManager = localStorageManager;
  }

  /**
   * Adds or updates a segment in the local storage.
   * @param {Object} segment - The segment object to upsert.
   */
  upsert(segment) {
    this.localStorageManager.upsertSegment(segment);
  }

  /**
   * Deletes a segment by its ID from the local storage.
   * @param {String} id - The ID of the segment to delete.
   */
  deleteById(id) {
    this.localStorageManager.deleteSegment(id);
  }

  /**
   * Sets the initial state of all segments (bulk operation).
   * @param {Array} segments - The array of segment objects to set.
   */
  setAll(segments) {
    this.localStorageManager.setAllSegments(segments);
  }

  /**
   * Retrieves all segments as a Map for quick lookup.
   * @returns {Map<String, Object>} A map of segment ID to segment object.
   */
  getAllAsMap() {
    return this.localStorageManager.getSegmentsMap();
  }
}

module.exports = SegmentStore;
