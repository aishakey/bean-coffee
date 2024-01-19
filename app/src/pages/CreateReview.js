import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  uploadPhotos,
  submitReview,
  checkCoffeeShopExists,
} from "../services/reviewService";
import "./createReview.css";
import ErrorMessage from "../components/ErrorMessage";
import HappyBean from "../assets/happy-bean.svg";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import useFormSubmission from "../hooks/useFormSubmission";
import MainPhotoModal from "../components/MainPhotoModal";

const CreateReview = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormSubmission();

  const [formData, setFormData] = useState({
    coffeeShopName: "",
    reviewTitle: "",
    location: "",
    wifi: "",
    seating: "",
    vibe: "",
    food: "",
    drink: "",
    noiseLevel: "",
    additional: "",
  });

  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [needsMainPhoto, setNeedsMainPhoto] = useState(false);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [isMainPhotoModalOpen, setIsMainPhotoModalOpen] = useState(false);
  const [error, setError] = useState([]);

  const navigate = useNavigate();

  const timeoutRef = useRef(null);

  const coffeeShopNameInputRef = useRef(null);

  useEffect(() => {
    if (coffeeShopNameInputRef.current) {
      coffeeShopNameInputRef.current.focus();
    }

    const currentTimeoutRef = timeoutRef.current;

    return () => {
      if (currentTimeoutRef) {
        clearTimeout(currentTimeoutRef);
      }
    };
  }, []);

  const addError = (errorMessage) => {
    setError((prevErrors) => [...prevErrors, errorMessage]);
  };

  const removeError = (errorIndex) => {
    setError((prevErrors) =>
      prevErrors.filter((_, index) => index !== errorIndex)
    );
  };

  const handleLocationChange = (address) => {
    setFormData({ ...formData, location: address });
  };

  const handleLocationSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      console.log("Success", latLng);

      setFormData({ ...formData, location: address });

      const { exists } = await checkCoffeeShopExists(address);

      if (!exists) {
        setIsMainPhotoModalOpen(true);
      } else {
        setNeedsMainPhoto(false);
      }
    } catch (error) {
      console.error("Error", error);
      setError(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e) => {
    const selectedFiles = [...e.target.files];
    let isValid = true;
    let errorMessage = "";

    for (const file of selectedFiles) {
      if (!file.type.match("image/jpeg")) {
        errorMessage = "Invalid file type. Only JPEG files are allowed.";
        isValid = false;
        break;
      }
      if (file.size > 5000000) {
        errorMessage = "File size too large. Max size is 5MB.";
        isValid = false;
        break;
      }
    }

    if (isValid) {
      setSelectedPhotos(selectedFiles);
      addError("");
    } else {
      addError(errorMessage);
      setSelectedPhotos([]);
    }
  };

  const confirmPhoto = () => {
    if (!mainPhoto) {
      addError("Please upload a main photo.");
      return;
    }
    setIsMainPhotoModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    // Validating text inputs
    if (!formData.coffeeShopName.trim())
      errors.coffeeShopName = "Coffee Shop Name is required";
    if (!formData.reviewTitle.trim())
      errors.reviewTitle = "Review Title is required";
    // Validating location
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    // Validating dropdowns
    if (!formData.wifi) {
      errors.wifi = "Please select a WiFi Speed";
    }
    if (!formData.seating) {
      errors.seating = "Please select a Seating criteria";
    }
    if (!formData.vibe) {
      errors.vibe = "Please select a Vibe";
    }
    if (!formData.food) {
      errors.food = "Please select a Food criteria";
    }
    if (!formData.drink) {
      errors.drink = "Please select a Drink criteria";
    }
    if (!formData.noiseLevel) {
      errors.noiseLevel = "Please select noise level";
    }

    // Validating photos
    if (needsMainPhoto && !mainPhoto)
      errors.mainPhoto = "Main photo is required";

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((errorMsg) => addError(errorMsg));
      stopSubmitting();
      return;
    }

    startSubmitting();
    setError([]);
    setSubmissionSuccess(false);

    if (!isAuthenticated) {
      addError("You must be logged in to submit a review.");
      stopSubmitting();
      return;
    }

    const token = localStorage.getItem("authToken");
    let userId = null;
    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    }

    if (!userId) {
      console.error("User ID is not available. User might not be logged in.");
      stopSubmitting();
      return;
    }

    let photoUrls = [];

    if (needsMainPhoto && !mainPhoto) {
      setError("Please upload a main photo for the new coffee shop.");
      setIsMainPhotoModalOpen(true);
      stopSubmitting();
      return;
    }

    if (mainPhoto) {
      try {
        const mainPhotoUploadResponse = await uploadPhotos([mainPhoto]);
        photoUrls.push(...mainPhotoUploadResponse.urls);
      } catch (uploadError) {
        setError("Failed to upload main photo.");
        console.error(uploadError);
        stopSubmitting();
        return;
      }
    }

    if (selectedPhotos.length > 0) {
      try {
        const uploadResponse = await uploadPhotos(selectedPhotos);
        photoUrls.push(...uploadResponse.urls);
      } catch (uploadError) {
        setError("Failed to upload additional photos.");
        console.error(uploadError);
        stopSubmitting();
        return;
      }
    }

    const reviewData = {
      userId: userId,
      coffeeShopDetails: {
        name: formData.coffeeShopName,
        location: formData.location,
      },
      reviewContent: {
        title: formData.reviewTitle,
        wifiSpeed: formData.wifi,
        seating: formData.seating,
        vibe: formData.vibe,
        food: formData.food,
        drink: formData.drink,
        noisy: formData.noiseLevel,
        additionalComments: formData.additional,
      },
      photoUrls: photoUrls,
    };

    try {
      await submitReview(reviewData);
      setSubmissionSuccess(true);
      setTimeout(() => {
        setSubmissionSuccess(false);
        navigate("/my-reviews");
      }, 2000);
    } catch (submitError) {
      console.error(submitError);
      addError(submitError.message || "Error submitting review.");
    }
    stopSubmitting();
  };

  return (
    <div>
      {error.map((message, index) => (
        <ErrorMessage
          key={index}
          message={message}
          onClose={() => removeError(index)}
        />
      ))}
      {isMainPhotoModalOpen && (
        <MainPhotoModal
          isOpen={isMainPhotoModalOpen}
          mainPhoto={mainPhoto}
          setMainPhoto={setMainPhoto}
          onConfirm={confirmPhoto}
          onGoToProfile={() => navigate("/profile")}
        />
      )}
      {submissionSuccess && (
        <div className="submission-success-message">
          <div className="submission-success-content">
            <img src={HappyBean} alt="Success" className="success-icon" />
            <p>Your review has been submitted successfully!</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="review-form">
        <div className="header">
          <h2>Create Review</h2>
          {mainPhoto && (
            <img
              src={URL.createObjectURL(mainPhoto)}
              alt="Main  Preview"
              className="main-photo-preview"
            />
          )}
          <input
            ref={coffeeShopNameInputRef}
            type="text"
            name="coffeeShopName"
            value={formData.coffeeShopName}
            onChange={handleChange}
            placeholder="Coffee Shop Name"
          />

          <input
            type="text"
            name="reviewTitle"
            value={formData.reviewTitle}
            onChange={handleChange}
            placeholder="Review Title"
          />

          <div className="location-container">
            <PlacesAutocomplete
              value={formData.location}
              onChange={handleLocationChange}
              onSelect={handleLocationSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      id: "locationSearch",
                      placeholder: "Location ...",
                      className: "location-search-input",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";

                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                          })}
                          key={suggestion.placeId}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className="photo-upload-container">
            <label htmlFor="photo-upload">Upload Photos:</label>
            <input
              type="file"
              id="photo-upload"
              name="photos"
              accept="image/jpeg"
              multiple
              onChange={handlePhotoSelect}
            />
          </div>
        </div>
        {/* Dropdowns for categories */}
        <div className="review-body">
          <div className="select-container">
            <select name="wifi" value={formData.wifi} onChange={handleChange}>
              <option disabled value="">
                WiFi Speed
              </option>
              <option value="Fast">Fast</option>
              <option value="Moderate">Moderate</option>
              <option value="Slow">Slow</option>
            </select>

            <select
              name="seating"
              value={formData.seating}
              onChange={handleChange}
            >
              <option disabled value="">
                Seating
              </option>
              <option value="Great for working">Great for working</option>
              <option value="Just okay">Just okay</option>
              <option value="Not suitable for working">
                Not suitable for working
              </option>
            </select>

            <select name="vibe" value={formData.vibe} onChange={handleChange}>
              <option disabled value="">
                Vibe
              </option>
              <option value="Cozy">Cozy</option>
              <option value="Modern">Modern</option>
              <option value="Cool">Cool</option>
              <option value="Unique">Unique</option>
              <option value="Local">Local</option>
            </select>

            <select name="food" value={formData.food} onChange={handleChange}>
              <option disabled value="">
                Food Options
              </option>
              <option value="Full meals">Full meals</option>
              <option value="Snacks">Snacks</option>
              <option value="Baked goods">Baked goods</option>
              <option value="None">None</option>
            </select>

            <select name="drink" value={formData.drink} onChange={handleChange}>
              <option disabled value="">
                Drink Quality
              </option>
              <option value="Great">Great</option>
              <option value="So so">So so</option>
              <option value="Not good">Not good</option>
            </select>

            <select
              name="noiseLevel"
              value={formData.noiseLevel}
              onChange={handleChange}
            >
              <option disabled value="">
                Noise Level
              </option>
              <option value="Loud">Loud</option>
              <option value="Normal">Normal</option>
              <option value="Quiet">Quiet</option>
            </select>
          </div>
          <div className="additional-container">
            <textarea
              name="additional"
              value={formData.additional}
              onChange={handleChange}
              placeholder="Additional thoughts"
            />
            <button
              className={`form-btn ${isSubmitting ? "loading-btn" : ""}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;
