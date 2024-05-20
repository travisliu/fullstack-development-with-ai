import React, { useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import ModifyFeatureFlagForm from '@/components/FeatureFlags/ModifyFeatureFlagForm';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { createFeatureFlag } from '@/services/featureFlagService';
// Assume necessary hooks and services for handling creation are imported

export default function CreateFeatureFlagPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    enabled: false,
    type: 'release', // Default type
    segments: [],
  });

  const handleChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleSave = async () => {
    // Add logic to call createFeatureFlag service function
    try {
      const newFeatureflag = await createFeatureFlag(formData, user.token);
      router.push('/featureflags'); // Redirect on success
    } catch (error) {
      console.error('Failed to create feature flag:', error);
      setError(error.message);
    }
  };

  const handleCancel = () => {
    router.push('/featureflags'); // Redirect on cancel
  };

  // Assume segmentsOptions is fetched or defined here

  return (
    <AdminLayout>
      <section className="content">
      <div className="card">
      <div className="card-header">
        New Feature Flag
      </div>
      <div className="card-body">
        { error && (
          <div className="alert alert-danger">
            {error.split('\n').map((line, index) => (
              <span key={index}>{line}<br /></span>
            ))}
          </div>
        )}
        <ModifyFeatureFlagForm
          initialData={formData}
          onChange={handleChange}
          // segmentsOptions={/* You need to pass the segments options here */}
        />
      </div>
      <div className="card-footer">
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
      </section>
    </AdminLayout>
  );
}
