// pages/segments/index.js or similar
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import SegmentService from '@/services/segmentService';
import SegmentList from '@/components/Segments/SegmentList';
import SearchBar from '@/components/Commons/SearchBar';

/**
 * SegmentsPage Component
 * 
 * @data-testid
 * SegmentsPage-content-header - Used to select the content header section in the `SegmentsPage` component.
 * SegmentsPage-header - Used to select the main heading in the `SegmentsPage` component.
 * SegmentsPage-content - Used to select the main content section in the `SegmentsPage` component.
 * SegmentsPage-loading - Used to select the loading message in the `SegmentsPage` component.
 * SegmentsPage-error - Used to select the error message in the `SegmentsPage` component.
 * SegmentsPage-createSegmentButton - Used to select the "Create Segment" button in the `SegmentsPage` component.
 */
const SegmentsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [segments, setSegments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user.token) {
      fetchSegments();
    }
  }, [isAuthenticated, user?.token, currentPage, searchQuery]);

  const fetchSegments = async () => {
    setLoading(true);
    try {
      // Assume segmentService.getAllSegments returns data with pagination info
      const { segments, total } = await SegmentService.getAllSegments({ page: currentPage, limit: 10, query: searchQuery }, user.token);
      setSegments(segments);
      setTotalPages(total);
    } catch (error) {
      console.error('Error fetching segments:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await SegmentService.deleteSegment(id, user.token);
      fetchSegments(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting segment:', err);
      setError('Failed to delete segment.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchSegments();
  };

  const handleSearchSubmit = (searchQuery) => {
    setSearchQuery(searchQuery);
    
  };

  const navigateToCreateSegment = () => {
    router.push('/segments/new'); // Adjust the path as necessary
  };

  return (
    <AdminLayout>
      <section className="content-header" data-testid="SegmentsPage-content-header">
        <h1 data-testid="SegmentsPage-header">User Segments</h1>
      </section>
      <section className="content" data-testid="SegmentsPage-content">
        {loading ? (
          <p data-testid="SegmentsPage-loading">Loading segments...</p>
        ) : error ? (
          <div className="alert alert-danger" data-testid="SegmentsPage-error">{error}</div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Segments</h3>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <button
                    className="btn btn-primary"
                    id="createSegmentButton"
                    onClick={navigateToCreateSegment}
                    data-testid="SegmentsPage-createSegmentButton"
                  >
                    Create Segment
                  </button>
                </div>
                <div className="col-sm-6 text-right">
                  <SearchBar onSearch={handleSearchSubmit} initialSearchTerm={searchQuery} />
                </div>
              </div>
              <SegmentList
                segments={segments}
                onDelete={handleDelete}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
};

export default SegmentsPage;
