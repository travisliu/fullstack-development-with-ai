import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { featureFlagService } from '@/services/featureFlagService';
import SegmentService from '@/services/segmentService';

const SegmentSelector = ({ selectedSegments, setSelectedSegments }) => {
  const { user } = useAuth();
  const [allSegments, setAllSegments] = useState([]);
  const [newSegmentName, setNewSegmentName] = useState('');

  const handleAddSegment = () => {
    const segment = allSegments.find(seg => seg.name === newSegmentName);
    if (segment) {
      setSelectedSegments([...selectedSegments, segment.id]);
      setNewSegmentName('');
    }
  };

  useEffect(() => {
    if (!user?.token) return;

    const fetchSegments = async () => {
      const segments = await SegmentService.getAllSegments({}, user?.token);
      setAllSegments(segments.segments);
    };

    fetchSegments();
  }, [user?.token]);

  const handleRemoveSegment = (index) => {
    const newList = [...selectedSegments];
    newList.splice(index, 1);
    setSelectedSegments(newList);
  };

  const handleNewSegmentNameChange = (event) => {
    setNewSegmentName(event.target.value);
  };

  return (
    <div>
      {selectedSegments.map((segmentId, index) => (
        <div key={index} className="form-group">
          <div className="input-group mb-3">
            <input type="text" className="form-control" readOnly value={allSegments.find(seg => seg.id === segmentId)?.name || 'Unknown Segment'} />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={() => handleRemoveSegment(index)}>Remove</button>
            </div>
          </div>
        </div>
      ))}

      <div className="form-group">
        <label htmlFor="newSegment">Add New Segment</label>
        <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          id="newSegment"
          value={newSegmentName}
          onChange={handleNewSegmentNameChange}
          list="segments-datalist"
          placeholder="Type to search..."
        />
        <span className="input-group-append">
          <button type="button" className="btn btn-info btn-flat" onClick={handleAddSegment}>Add Segment</button>
        </span>
        </div>
        <datalist id="segments-datalist">
          {allSegments.map(segment => (
            <option key={segment.id} value={segment.name} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default SegmentSelector;
