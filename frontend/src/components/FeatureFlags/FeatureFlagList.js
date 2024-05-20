// src/components/FeatureFlags/FeatureFlagList.js
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Pagination from '@/components/Commons/Pagination';

/**
 * FeatureFlagList component.
 *
 * @component
 * @param {Object[]} flags - Array of feature flags.
 * @param {function} onDelete - Function to call when a flag is deleted.
 * @param {number} currentPage - Current page number.
 * @param {number} totalPages - Total number of pages.
 * @param {function} onPageChange - Function to call when the page changes.
 *
 * @example
 * <FeatureFlagList flags={flags} onDelete={onDelete} currentPage={1} totalPages={5} onPageChange={onPageChange} />
 *
 * @data-testid
 * FeatureFlagList-no-flags - This attribute is added to the paragraph that is displayed when there are no feature flags.
 * FeatureFlagList-table - This attribute is added to the div that contains the table of feature flags.
 * FeatureFlagList-edit-{id} - This attribute is added to the Edit button for each feature flag. The {id} is replaced with the id of the feature flag.
 * FeatureFlagList-delete-{id} - This attribute is added to the Delete button for each feature flag. The {id} is replaced with the id of the feature flag.
 * FeatureFlagList-pagination - This attribute is added to the Pagination component.
 */
const FeatureFlagList = ({ flags, onDelete, currentPage, totalPages, onPageChange }) => {
  if (!flags.length) {
    return <p data-testid="FeatureFlagList-no-flags">No feature flags found.</p>;
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this flag?')) {
      onDelete(id);
    }
  };

  return (
    <>
      <div className="table-responsive" data-testid="FeatureFlagList-table">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((flag) => (
              <tr key={flag.id}>
                <td>{flag.name}</td>
                <td>{flag.enabled ? 'Enabled' : 'Disabled'}</td>
                <td>{flag.type}</td>
                <td>
                  <Link className="btn btn-sm btn-info" href={`/featureflags/${flag.id}`} data-testid={`FeatureFlagList-edit-${flag.id}`}>
                    Edit
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(flag.id)} data-testid={`FeatureFlagList-delete-${flag.id}`}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} data-testid="FeatureFlagList-pagination" />
    </>
  );
};

FeatureFlagList.propTypes = {
  flags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired,
      segments: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onDelete: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default FeatureFlagList;
