import React from 'react';
import Link from 'next/link';

/**
 * Pagination component
 *
 * @component
 *
 * @example
 * <Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
 *
 * @prop {number} currentPage - The current active page
 * @prop {number} totalPages - The total number of pages
 * @prop {function} onPageChange - The function to call when a page link is clicked
 *
 * @dataTestId Pagination-nav - Identifies the `nav` element of the Pagination component
 * @dataTestId Pagination-ul - Identifies the `ul` element of the Pagination component
 * @dataTestId Pagination-previous-li - Identifies the `li` element for the Previous page link
 * @dataTestId Pagination-previous-link - Identifies the Previous page `Link` component
 * @dataTestId Pagination-current-li - Identifies the `li` element for the current page
 * @dataTestId Pagination-current-link - Identifies the current page `Link` component
 * @dataTestId Pagination-next-li - Identifies the `li` element for the Next page link
 * @dataTestId Pagination-next-link - Identifies the Next page `Link` component
 */
export default ({ currentPage, totalPages, onPageChange }) => {
  return (
    <nav aria-label="Page navigation example" data-testid="Pagination-nav">
      <ul className="pagination" data-testid="Pagination-ul">
        <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`} data-testid="Pagination-previous-li">
          <Link className="page-link" href="#" onClick={() => onPageChange(currentPage - 1)} data-testid="Pagination-previous-link">Previous</Link>
        </li>
        <li className="page-item active" data-testid="Pagination-current-li">
          <Link className="page-link" href="#" data-testid="Pagination-current-link">{currentPage}</Link>
        </li>
        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`} data-testid="Pagination-next-li">
          <Link className="page-link" href="#" onClick={() => onPageChange(currentPage + 1)} data-testid="Pagination-next-link">Next</Link>
        </li>
      </ul>
    </nav>
  );
};