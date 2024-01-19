import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./mainPhotoModal.css";

const MainPhotoModal = ({
  isOpen,
  mainPhoto,
  setMainPhoto,
  onConfirm,
  onGoToProfile,
}) => {
  const fileInputRef = useRef();

  useEffect(() => {
    return () => {
      if (mainPhoto) {
        URL.revokeObjectURL(mainPhoto);
      }
    };
  }, [mainPhoto]);

  const openFilePicker = () => {
    if (mainPhoto) {
      URL.revokeObjectURL(mainPhoto);
    }
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="main-photo-modal">
      <div className="modal-content">
        <p>Since you're the first reviewer, please attach the main photo.</p>
        <input
          type="file"
          accept="image/jpeg"
          onChange={(e) => setMainPhoto(e.target.files[0])}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {mainPhoto && (
          <>
            <img src={URL.createObjectURL(mainPhoto)} alt="Main Preview" />
            <button onClick={onConfirm} className="confirm-btn">
              Confirm
            </button>
          </>
        )}
        <button onClick={openFilePicker} className="pick-btn">
          Pick New Photo
        </button>
        <button onClick={onGoToProfile} className="go-to-profile-btn">
          Go to Profile
        </button>
      </div>
    </div>
  );
};

MainPhotoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mainPhoto: PropTypes.object,
  setMainPhoto: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onGoToProfile: PropTypes.func.isRequired,
};

export default MainPhotoModal;
