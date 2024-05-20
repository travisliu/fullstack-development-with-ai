import React, { useEffect, useState } from 'react';

/**
 * @component
 * @param {Object} initialData - The initial form data.
 * @param {Function} onChange - The function to call when the form data changes.
 *
 * @data-testid
 * EditSegmentForm-form - Used to select the form element in the `EditSegmentForm` component.
 * EditSegmentForm-name-label - Used to select the label for the name field.
 * EditSegmentForm-name-input - Used to select the input field for the name.
 * EditSegmentForm-description-label - Used to select the label for the description field.
 * EditSegmentForm-description-textarea - Used to select the textarea for the description.
 * EditSegmentForm-criteria-label - Used to select the label for the criteria section.
 * EditSegmentForm-criteria-<index> - Used to select the div that contains the attribute, operator, and value fields for a criterion at a specific index.
 * EditSegmentForm-criteria-<index>-attribute - Used to select the attribute field for a criterion at a specific index.
 * EditSegmentForm-criteria-<index>-operator - Used to select the operator field for a criterion at a specific index.
 * EditSegmentForm-criteria-<index>-equals - Used to select the equals option in the operator field for a criterion at a specific index.
 * EditSegmentForm-criteria-<index>-greater_than - Used to select the greater than option in the operator field for a criterion at a specific index.
 * EditSegmentForm-criteria-<index>-less_than - Used to select the less than option in the operator field for a criterion at a specific index.
 * EditSegmentForm-criteria-<index>-value - Used to select the value field for a criterion at a specific index.
 * EditSegmentForm-criteria-<index>-remove-button - Used to select the remove button for a criterion at a specific index.
 * EditSegmentForm-addCriterion-button - Used to select the button to add a new criterion.
 */
const EditSegmentForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState(initialData || { name: '', description: '', criteria: [{ attribute: '', operator: '', value: '' }] });

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Handle form field changes
  const handleChange = (e, index, field) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      let updatedFormData;
      if (field) {
        const updatedCriteria = [...prevFormData.criteria];
        updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
        updatedFormData = { ...prevFormData, criteria: updatedCriteria };
      } else {
        updatedFormData = { ...prevFormData, [name]: value };
      }
      onChange && onChange(updatedFormData); // Consider the async nature of setState
      return updatedFormData;
    });
  };

  // Remove a criterion
  const removeCriterion = (index) => {
    setFormData(prevFormData => {
      const updatedCriteria = [...prevFormData.criteria];
      updatedCriteria.splice(index, 1);
      const newFormData = { ...prevFormData, criteria: updatedCriteria };
      onChange && onChange(newFormData); // Call onChange with the updated state
      return newFormData;
    });
  };


  // Add a criterion
  const addCriterion = (event) => {
    event.preventDefault();
    setFormData(prevFormData => {
      const updatedCriteria = [...prevFormData.criteria, { attribute: '', operator: 'equals', value: '' }];
      const newFormData = { ...prevFormData, criteria: updatedCriteria };
      // Call onChange here if it's crucial to have the updated state immediately, 
      // or consider using useEffect to watch formData and call onChange there.
      onChange && onChange(newFormData); // Note: This might still not reflect immediately in parent component
      return newFormData;
    });
  };

  return (
    <form className="form-horizontal" data-testid="EditSegmentForm-form">
      <div className="form-group row">
        <label htmlFor="name" data-testid="EditSegmentForm-name-label">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          required
          data-testid="EditSegmentForm-name-input"
        />
      </div>
      <div className="form-group row">
        <label htmlFor="description" data-testid="EditSegmentForm-description-label">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          data-testid="EditSegmentForm-description-textarea"
        />
      </div>

      <hr />

      <label data-testid="EditSegmentForm-criteria-label">Criteria</label>
      {formData.criteria.map((item, index) => (
        <div key={index} className="form-inline" data-testid={`EditSegmentForm-criteria-${index}`}>
          <input
            type="text"
            placeholder="Attribute"
            value={item.attribute}
            onChange={(e) => handleChange(e, index, 'attribute')}
            className="form-control mb-2 mr-sm-2"
            data-testid={`EditSegmentForm-criteria-${index}-attribute`}
          />
          <select
            value={item.operator}
            onChange={(e) => handleChange(e, index, 'operator')}
            className="form-control mb-2 mr-sm-2"
            data-testid={`EditSegmentForm-criteria-${index}-operator`}
          >
            <option value="equals" data-testid={`EditSegmentForm-criteria-${index}-equals`}>=</option>
            <option value="greater_than" data-testid={`EditSegmentForm-criteria-${index}-greater_than`}>&gt;</option>
            <option value="less_than" data-testid={`EditSegmentForm-criteria-${index}-less_than`}>&lt;</option>
          </select>
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => handleChange(e, index, 'value')}
            className="form-control mb-2 mr-sm-2"
            data-testid={`EditSegmentForm-criteria-${index}-value`}
          />
          <button type="button" className="btn btn-danger mb-2" onClick={() => removeCriterion(index)} data-testid={`EditSegmentForm-criteria-${index}-remove-button`}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-default" onClick={addCriterion} data-testid="EditSegmentForm-addCriterion-button">
        Add Criterion
      </button>
    </form>
  );
};

export default EditSegmentForm;
