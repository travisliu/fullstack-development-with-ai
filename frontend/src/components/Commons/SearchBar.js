// src/components/FeatureFlags/SearchBar.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * `SearchBar` is a functional component that renders a search bar form.
 * It maintains its own state for the search term and calls the `onSearch` prop function when the form is submitted.
 * 
 * @module @/components/Commons/SearchBar
 * 
 * @param {Object} props - The props object
 * @param {function} props.onSearch - The function to be called when the form is submitted
 * @param {string} props.initialSearchTerm - The current search term
 * 
 * @returns {JSX.Element} The SearchBar component
 * 
 * @data-testid
 * SearchBar-form - Used to select the form element in the `SearchBar` component.
 * SearchBar-input-group - Used to select the input group element in the `SearchBar` component.
 * SearchBar-input - Used to select the input field in the `SearchBar` component.
 * SearchBar-input-group-append - Used to select the input group append element in the `SearchBar` component.
 * SearchBar-submit-button - Used to select the submit button in the `SearchBar` component.
 */
const SearchBar = ({ onSearch, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from causing a page reload
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar mb-3" data-testid="SearchBar-form">
      <div className="input-group" data-testid="SearchBar-input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search for feature flags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="SearchBar-input"
        />
        <div className="input-group-append" data-testid="SearchBar-input-group-append">
          <button type="submit" className="btn btn-light" data-testid="SearchBar-submit-button">
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  initialSearchTerm: PropTypes.string,
};

export default SearchBar;
