import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { getFeatureFlagById, updateFeatureFlag } from '@/services/featureFlagService';
import AdminLayout from '@/components/Layout/AdminLayout';
import ModifyFeatureFlagForm from '@/components/FeatureFlags/ModifyFeatureFlagForm';

const ModifyFeatureFlagPage = ({ match }) => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [flagData, setFlagData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatureFlag = async () => {
      setError('');
      try {
        const data = await getFeatureFlagById(id, user.token);
        setFlagData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    };

    if(id) fetchFeatureFlag();
  }, [user, id]);

  const handleSave = async () => {
    if (!user || !user.token) {
      setError('You must be logged in to modify a feature flag.');
      return;
    }

    try {
      setLoading(true); // Enable loading indicator
      await updateFeatureFlag(id, flagData, user.token);
      alert('Feature flag updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Disable loading indicator
    }
  };

  const handleChange = (newData) => {
    setFlagData(newData);
  };

  return (
    <AdminLayout>
      <section className="content-header">
        <h1>Modify Feature Flag</h1>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-body">
            {loading || !flagData ? ( // Render loading indicator if loading state is true
              <p>Loading feature flag data...</p>
            ) : (
              <>
                { error && (
                  <div className="alert alert-danger">
                    {error.split('\n').map((line, index) => (
                      <span key={index}>{line}<br /></span>
                    ))}
                  </div>
                )}
                <ModifyFeatureFlagForm
                  initialData={flagData}
                  onChange={handleChange}
                />
              </> 
            )}
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={() => handleSave(flagData)}>
              Save
            </button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default ModifyFeatureFlagPage;
