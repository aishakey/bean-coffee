import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserReviews, deleteReview } from "../services/reviewService";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import "./userReviews.css";

const UserReviews = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("pending");

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const userReviews = await getUserReviews();
        if (isMounted) {
          setReviews(userReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to fetch reviews. Please try again later.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchReviews();
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleCreateReview = () => {
    navigate("/create-review");
  };

  const handleDelete = (reviewId) => {
    setDeletingReviewId(reviewId);
    setIsDeleteModalOpen(true);
    setDeleteStatus("pending");
  };

  const confirmDelete = async () => {
    try {
      const success = await deleteReview(deletingReviewId);
      if (success) {
        const updatedReviews = reviews.filter(
          (review) => review._id !== deletingReviewId
        );
        setReviews(updatedReviews);
        setDeleteStatus("success");
      } else {
        setDeleteStatus("failed");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setDeleteStatus("failed");
    }
  };

  const DeleteConfirmationModal = () => {
    const getModalContent = () => {
      switch (deleteStatus) {
        case "pending":
          return (
            <div>
              <p>Are you sure you want to delete this review?</p>
              <button onClick={confirmDelete}>delete</button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="cancel-btn"
              >
                cancel
              </button>
            </div>
          );
        case "success":
          return (
            <div>
              <p>Review deleted successfully!</p>
              <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
            </div>
          );
        case "failed":
          return (
            <div>
              <p>Failed to delete review. Please try again.</p>
              <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="modal">
        <div className="modal-content">{getModalContent()}</div>
      </div>
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onClose={() => setError("")} />;
  }

  return (
    <div className="reviews-page">
      {isDeleteModalOpen && <DeleteConfirmationModal />}
      <h2>MY REVIEWS</h2>
      {reviews.length > 0 ? (
        <div className="reviews-container">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <h3 className="coffee-shop-name">
                {review.coffeeShop?.name || "Coffee Shop Name"}
              </h3>
              <p className="location">{review.coffeeShop?.location}</p>
              <h4 className="review-title">{review.title.toUpperCase()}</h4>
              <div className="review-details-grid">
                <p className="review-detail">
                  <span className="question">WiFi Speed:</span>{" "}
                  {review.wifiSpeed}
                </p>
                <p className="review-detail">
                  <span className="question">Seating:</span> {review.seating}
                </p>
                <p className="review-detail">
                  <span className="question">Vibe:</span> {review.vibe}
                </p>
                <p className="review-detail">
                  <span className="question">Food:</span> {review.food}
                </p>
                <p className="review-detail">
                  <span className="question">Drink:</span> {review.drink}
                </p>
                <p className="review-detail">
                  <span className="question">Noise Level:</span> {review.noisy}
                </p>
              </div>
              {review.additionalComments && (
                <p className="review-detail comments">
                  <span className="question">Comments:</span>{" "}
                  {review.additionalComments}
                </p>
              )}
              <div className="review-photos">
                {review.photos &&
                  review.photos.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Review"
                      className="review-photo"
                    />
                  ))}
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="delete-btn"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews found.</p>
      )}
      {!reviews.length && !isLoading && (
        <button onClick={handleCreateReview} className="create-btn">
          Create Review
        </button>
      )}
    </div>
  );
};

export default UserReviews;
