// FeatureEvaluator.js

/**
 * Class responsible for evaluating feature flags based on segment criteria.
 */
class FeatureEvaluator {
  /**
   * Evaluates a feature flag for a given set of user attributes.
   * @param {Object} featureFlag - The feature flag to evaluate.
   * @param {Object} userAttributes - Attributes of the user for evaluation.
   * @param {Map<String, Object>} segmentsMap - A map of segmentId to segment criteria.
   * @returns {boolean} - True if the feature flag is enabled for the user, false otherwise.
   */
  evaluate(featureFlag, userAttributes, segmentsMap) {
    // Check if feature flag is globally enabled or disabled
    if (!featureFlag.enabled) {
      return false;
    }

    // If the feature flag doesn't specify segments, it's globally enabled
    if (!featureFlag.segments || featureFlag.segments.length === 0) {
      return true;
    }

    // Evaluate each segment
    for (let segmentId of featureFlag.segments) {
      const segment = segmentsMap.get(segmentId);
      if (this.evaluateSegment(segment, userAttributes)) {
        return true; // User matches the criteria of at least one segment
      }
    }

    return false; // User does not match the criteria of any segments
  }

  /**
   * Evaluates if user attributes match a segment's criteria.
   * @param {Object} segment - The segment to evaluate.
   * @param {Object} userAttributes - Attributes of the user for evaluation.
   * @returns {boolean} - True if the user matches the segment criteria, false otherwise.
   */
  evaluateSegment(segment, userAttributes) {
    for (let criteria of segment.criteria) {
      const userValue = userAttributes[criteria.attribute];
      if (!this.meetsCriteria(userValue, criteria)) {
        return false; // User does not meet this criteria
      }
    }

    return true; // User meets all criteria in the segment
  }

  /**
   * Determines if a user's attribute value meets a segment's criteria.
   * @param {any} userValue - The value to evaluate.
   * @param {Object} criteria - The criteria to evaluate against.
   * @returns {boolean} - True if the criteria is met, false otherwise.
   */
  meetsCriteria(userValue, criteria) {
    switch (criteria.operator) {
      case 'equals':
        return userValue === criteria.value;
      case 'greater_than':
        return userValue > parseInt(criteria.value);
      case 'less_than':
        return userValue < parseInt(criteria.value);
      // Add more operators as needed
      default:
        throw new Error(`Unsupported operator ${criteria.operator}`);
    }
  }
}

module.exports = FeatureEvaluator;
