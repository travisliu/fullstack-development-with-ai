import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import EditSegmentForm from '@/components/Segments/EditSegmentForm'; // Assuming this is the refactored form component
import SegmentService from '@/services/segmentService';

const CreateSegment = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: [{ attribute: '', operator: 'equals', value: '' }]
  });

  const onChange = (formData) => {
    setFormData(prevFormData => ({ ...prevFormData, ...formData }));
  }

  const createNewSegment = async () => {
    setLoading(true);
    setError('');
    try {
      await SegmentService.createSegment(formData, user?.token);
      router.push('/segments'); // Redirect to segments page after creation
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <section className="content pt-3">
        <div className="card">
          <div className="card-header">
            Create New Segment 
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
                <>
                  <div className='card-body'>
                    {error && (
                      <div className="alert alert-danger">
                        {error.split('\n').map((line, index) => (
                          <span key={index}>{line}<br /></span>
                        ))}
                      </div>
                    )}
                    <EditSegmentForm initialData={formData} onChange={onChange} />
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-success" onClick={createNewSegment}>Create Segment</button>
                  </div>
                </>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default CreateSegment;
