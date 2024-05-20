// src/presenters/segmentPresenter.js

/**
 * Transforms a segment model instance into a client-friendly object.
 *
 * @param {Object} segment - The segment object from the database.
 * @returns {Object} The transformed segment object.
 */
function presentSegment(segment) {
  return {
      id: segment.id, // Ensuring 'id' is represented as a string
      name: segment.name,
      description: segment.description || '', // Providing a default empty string if description is null
      criteria: segment.criteria.map(criteria => ({
          attribute: criteria.attribute,
          operator: criteria.operator,
          value: criteria.value,
      })),
      // Include additional transformation as necessary
  };
}

/**
* Transforms an array of segment model instances into an array of client-friendly objects.
* Optionally includes pagination details if provided.
*
* @param {Array} segments - Array of segment objects from the database.
* @param {number} [total] - Optional total number of segments for pagination.
* @param {number} [page] - Optional current page number for pagination.
* @param {number} [limit] - Optional number of items per page for pagination.
* @returns {Object} The transformed segments array and pagination details, if applicable.
*/
function presentSegments(segments, total = null, page = null, limit = null) {
  const presentedSegments = segments.map(presentSegment);

  const result = { segments: presentedSegments };

  // If pagination details are provided, include them in the response
  if (total !== null && page !== null && limit !== null) {
      Object.assign(result, { total, page, limit });
  }

  return result;
}

module.exports = {
  presentSegment,
  presentSegments,
};
