import React, { useState, useEffect } from 'react';
import SegmentSelectComponent from './SegmentSelector';

/**
 * @module '@/components/FeatureFlags/ModifyFeatureFlagForm'
 * @desc A form component for modifying feature flag data.
 * @param {Object} props - The component props.
 * @param {Object} props.initialData - The initial data for the form.
 * @param {Function} props.onSave - The function to call when the form is saved.
 * @param {Function} props.onChange - The function to call when the form data changes.
 * @returns {JSX.Element} The ModifyFeatureFlagForm component.
  * @dataTestId
 * 
 * This component uses the following `data-testid` attributes for selecting elements in automated tests:
 * 
 * - `ModifyFeatureFlagForm-form`: Selects the entire form.
 * - `ModifyFeatureFlagForm-group-name`: Selects the form group for the feature flag name.
 * - `ModifyFeatureFlagForm-group-type`: Selects the form group for the feature flag type.
 * - `ModifyFeatureFlagForm-group-enabled`: Selects the form group for the feature flag enabled checkbox.
 * - `ModifyFeatureFlagForm-group-segments`: Selects the form group for the feature flag segments.
 * - `ModifyFeatureFlagForm-input-name`: Selects the input for the feature flag name.
 * - `ModifyFeatureFlagForm-select-type`: Selects the select box for the feature flag type.
 * - `ModifyFeatureFlagForm-checkbox-enabled`: Selects the checkbox for the feature flag enabled state.
 * - `ModifyFeatureFlagForm-segmentSelectComponent`: Selects the segment select component for the feature flag segments.
 */
const ModifyFeatureFlagForm = ({ initialData, onSave, onChange }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    // Notify parent component about form changes
    onChange(formData);
  }, [formData, onChange]);

  // Handle input changes for text inputs and select
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle changes for the checkbox
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  // Function to update segments in form data
  const handleSegmentChange = (selectedSegments) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      segments: selectedSegments,
    }));
  };

  return (
    <form className="form-horizontal" data-testid="ModifyFeatureFlagForm-form">
      <div className="form-group" data-testid="ModifyFeatureFlagForm-group-name">
        <label htmlFor="featureFlagName">Feature Flag Name</label>
        <input
          type="text"
          className="form-control"
          id="featureFlagName"
          name="name"
          placeholder="Enter feature flag name"
          value={formData.name || ''}
          onChange={handleInputChange}
          required
          data-testid="ModifyFeatureFlagForm-input-name"
        />
      </div>

      <div className="form-group" data-testid="ModifyFeatureFlagForm-group-type">
        <label htmlFor="featureFlagType">Type</label>
        <select
          className="form-control"
          id="featureFlagType"
          name="type"
          value={formData.type || ''}
          onChange={handleInputChange}
          data-testid="ModifyFeatureFlagForm-select-type"
        >
          <option value="release">Release</option>
          <option value="experimental">Experimental</option>
          <option value="operational">Operational</option>
        </select>
      </div>

      <div className="form-group" data-testid="ModifyFeatureFlagForm-group-enabled">
        <label>Enable</label>
        <div className="custom-control custom-switch mb-3">
          <input
            type="checkbox"
            className="custom-control-input"
            id="featureFlagEnabled"
            name="enabled"
            checked={formData.enabled || false}
            onChange={handleCheckboxChange}
            data-testid="ModifyFeatureFlagForm-checkbox-enabled"
          />
          <label className="custom-control-label" htmlFor="featureFlagEnabled"></label>
        </div>
      </div>
      
      <div className="form-group" data-testid="ModifyFeatureFlagForm-group-segments">
        <label>Segments</label>
        <SegmentSelectComponent
          selectedSegments={formData.segments || []}
          setSelectedSegments={handleSegmentChange}
          data-testid="ModifyFeatureFlagForm-segmentSelectComponent"
        />
      </div>
    </form>
  );
};

export default ModifyFeatureFlagForm;
