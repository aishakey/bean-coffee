import React from "react";
import PropTypes from "prop-types";
import "./imageModal.css";

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <img src={imageUrl} alt="Full Size" className="modal-image" />
    </div>
  );
};

ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ImageModal;
