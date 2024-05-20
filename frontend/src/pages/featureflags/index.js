// src/pages/FeatureFlagsPage.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/Layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  listFeatureFlags,
  deleteFeatureFlag,
} from '@/services/featureFlagService';
import FeatureFlagList from '@/components/FeatureFlags/FeatureFlagList';
import SearchBar from '@/components/Commons/SearchBar';

/**
 * FeatureFlagsPage Component
 * 
 * @component
 * 
 * @example
 * 
 * <FeatureFlagsPage />
 * 
 * @data-testid
 * 
 * - `FeatureFlagsPage-content-header`: This attribute is used to identify the content header section of the FeatureFlagsPage component.
 * - `FeatureFlagsPage-content`: This attribute is used to identify the main content section of the FeatureFlagsPage component.
 * - `FeatureFlagsPage-card`: This attribute is used to identify the card that wraps the main content of the FeatureFlagsPage component.
 * - `FeatureFlagsPage-card-header`: This attribute is used to identify the header of the card in the FeatureFlagsPage component.
 * - `FeatureFlagsPage-card-body`: This attribute is used to identify the body of the card in the FeatureFlagsPage component.
 * - `FeatureFlagsPage-error`: This attribute is used to identify the error message in the FeatureFlagsPage component.
 * - `FeatureFlagsPage-createFeatureFlagtButton`: This attribute is used to identify the "New Feature Flag" button in the FeatureFlagsPage component.
 */
const FeatureFlagsPage = () => {
  const { user } = useAuth();
  const [featureFlags, setFeatureFlags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFeatureFlags = async (token, page, searchQuery) => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await listFeatureFlags({ page, query: searchQuery }, token);
      setFeatureFlags(data.items); // Adjust according to your API response structure
      setCurrentPage(data.page); // Adjust based on actual API response
      setTotalPages(data.total); // Adjust based on actual API response
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch feature flags');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureFlags(user?.token, currentPage, searchQuery);
  }, [user, currentPage, searchQuery]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteFeatureFlag(id, user.token);
      fetchFeatureFlags(user.token, currentPage, searchQuery);
    } catch (err) {
      setError('Failed to delete feature flag');
      setLoading(false);
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query);
    fetchFeatureFlags(user?.token, currentPage, query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <section className="content-header" data-testid="FeatureFlagsPage-content-header">
        <h1>Feature Flags</h1>
      </section>
      <section className="content" data-testid="FeatureFlagsPage-content">
        <div className="card" data-testid="FeatureFlagsPage-card">
          <div className="card-header with-border" data-testid="FeatureFlagsPage-card-header">
            <h3 className="card-title">Manage Feature Flags</h3>
          </div>
          <div className="card-body" data-testid="FeatureFlagsPage-card-body">
            {error && <p className="text-danger" data-testid="FeatureFlagsPage-error">{error}</p>}
            <div className="row mb-2">
              <div className="col-sm-6">
                <Link
                  className="btn btn-primary"
                  id="createFeatureFlagButton"
                  href="/featureflags/new"
                  data-testid="FeatureFlagsPage-createFeatureFlagButton"
                >
                  New Feature Flag 
                </Link>
              </div>
              <div className="col-sm-6 text-right">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
            {loading ? (
              <p data-testid="FeatureFlagsPage-loading">Loading...</p>
            ) : (
              <FeatureFlagList
                flags={featureFlags}
                currentPage={currentPage}
                totalPages={totalPages}
                onDelete={handleDelete}
                onPageChange={handlePageChange} // Add the onPageChange callback
              />
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default FeatureFlagsPage;
