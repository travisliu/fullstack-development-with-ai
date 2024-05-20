// components/SegmentList.js
import React from 'react';
import Link from 'next/link';
import Pagination from '@/components/Commons/Pagination';


/**
 * SegmentList Component
 * 
 * @component
 * 
 * @data-testid
 * SegmentList - Used to select the main div in the `SegmentList` component.
 * SegmentList-row-{segmentName} - Used to select a specific row in the `SegmentList` component.
 * SegmentList-name-{segmentName} - Used to select the name cell of a specific row in the `SegmentList` component.
 * SegmentList-description-{segmentName} - Used to select the description cell of a specific row in the `SegmentList` component.
 * SegmentList-criterion-{segmentName}-{criterionIndex} - Used to select a specific criterion of a specific segment in the `SegmentList` component.
 * SegmentList-edit-{segmentName} - Used to select the Edit button of a specific row in the `SegmentList` component.
 * SegmentList-delete-{segmentName} - Used to select the Delete button of a specific row in the `SegmentList` component.
 * SegmentList-pagination - Used to select the Pagination component in the `SegmentList` component.
 */
const SegmentList = ({ segments, onDelete, onPageChange, currentPage, totalPages }) => {
  // Placeholder for delete confirmation logic
  const confirmDelete = (segmentId) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      onDelete(segmentId);
    }
  };

  return (
    <div data-testid="SegmentList">
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Criteria</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => {
              const segmentIndex = encodeURIComponent(segment.name);
              return (
                <tr key={segment.id} data-testid={`SegmentList-row-${segmentIndex}`}>
                  <td data-testid={`SegmentList-name-${segmentIndex}`}>{segment.name}</td>
                  <td data-testid={`SegmentList-description-${segmentIndex}`}>{segment.description || 'N/A'}</td>
                  <td>
                    {segment.criteria.map((criterion, criterionIndex) => (
                      <div key={criterionIndex} data-testid={`SegmentList-criterion-${segmentIndex}-${criterionIndex}`}>{`${criterion.attribute} ${criterion.operator} ${criterion.value}`}</div>
                    ))}
                  </td>
                  <td>
                    <Link className="btn btn-sm btn-info" href={`/segments/${segment.id}`} data-testid={`SegmentList-edit-${segmentIndex}`}>
                      Edit
                    </Link>
                    <button className="btn btn-sm btn-danger" onClick={() => confirmDelete(segment.id)} data-testid={`SegmentList-delete-${segmentIndex}`}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};

export default SegmentList;
