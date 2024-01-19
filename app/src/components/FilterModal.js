import React, { useState } from "react";
import PropTypes from "prop-types";
import "./filterModal.css";

const FilterModal = ({ isOpen, onClose, updateFilters, currentFilters }) => {
  const [localMinReviews, setLocalMinReviews] = useState(
    currentFilters.minReviews
  );
  const handleApply = () => {
    const appliedMinReviews = localMinReviews !== "" ? localMinReviews : "0";
    updateFilters(currentFilters.searchTerm, appliedMinReviews);
    onClose();
  };

  const handleClear = () => {
    setLocalMinReviews("");
    updateFilters(currentFilters.searchTerm, "0");
    onClose();
  };

  return (
    <div className={`filter-modal ${isOpen ? "show" : ""}`}>
      <span className="close-button" onClick={onClose}>
        &times;
      </span>
      <input
        type="number"
        placeholder="Minimum reviews..."
        value={localMinReviews}
        onChange={(e) => setLocalMinReviews(e.target.value)}
        min="0"
      />
      <button onClick={handleApply} className="modal-btn apply-filter-btn">
        Apply
      </button>
      <button onClick={handleClear} className="modal-btn clear-filter-btn">
        Clear
      </button>
    </div>
  );
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateFilters: PropTypes.func.isRequired,
  currentFilters: PropTypes.shape({
    searchTerm: PropTypes.string,
    minReviews: PropTypes.number,
  }).isRequired,
};

export default FilterModal;
