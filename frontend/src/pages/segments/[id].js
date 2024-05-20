// pages/segments/edit/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import EditSegmentForm from '@/components/Segments/EditSegmentForm';
import SegmentService from '@/services/segmentService';

const EditSegment = () => {
  const { query } = useRouter();
  const { id } = query;
  const { user } = useAuth();
  const [segmentData, setSegmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchSegment(id);
  }, [id]);

  const fetchSegment = async (segmentId) => {
    setLoading(true);
    setError('');
    try {
      const data = await SegmentService.getSegmentById(segmentId, user?.token);
      setSegmentData(data);
    } catch (err) {
      console.error('Error fetching segment:', err);
      setError('Failed to fetch segment.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    console.log('=== segmentData:', segmentData);
    try {
      await SegmentService.updateSegment(id, segmentData, user?.token);
      setError('');
      alert('Segment updated successfully!');
      // Redirect or update UI as needed
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormChange = (formData) => {
    setSegmentData(prevData => ({ ...prevData, ...formData }));
  } 

  return (
    <AdminLayout>
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Edit Segment</h3>
          </div>
          <div className="card-body">
            {loading || !segmentData ? (
              <p>Loading...</p>
            ) : (
              <>
                {error && (
                  <div className="alert alert-danger">
                    {error.split('\n').map((line, index) => (
                      <span key={index}>{line}<br /></span>
                    ))}
                  </div>
                )}
                <EditSegmentForm initialData={segmentData} onChange={handleFormChange} />
              </>
            )}
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              Update
            </button>
            <Link className="btn btn-secondary" href="/segments">
              Cancel
            </Link>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default EditSegment;