import React from "react";
import PropTypes from "prop-types";
import "./errorMessage.css";

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="error-message">
      {message}
      <button onClick={onClose} className="error-close-btn">
        X
      </button>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorMessage;
