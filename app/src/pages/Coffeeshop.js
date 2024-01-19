import React, { useEffect, useState } from "react";
import ImageModal from "../components/ImageModal";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useParams } from "react-router-dom";
import { getCoffeeShopDetails } from "../services/coffeeshopService";
import "./coffeeshop.css";

const CoffeeShop = () => {
  const [coffeeShop, setCoffeeShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchCoffeeShopDetails = async () => {
      setIsLoading(true);
      try {
        const shopDetails = await getCoffeeShopDetails(id);
        setCoffeeShop(shopDetails);
      } catch (error) {
        console.error("Error fetching coffee shop details:", error);
        setError("Failed to fetch coffee shop details.");
      }
      setIsLoading(false);
    };

    fetchCoffeeShopDetails();
  }, [id]);

  const openImageModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImage(null);
  };

  const allPhotoUrls =
    coffeeShop?.reviews?.reduce(
      (acc, review) => [...acc, ...(review.photos || [])],
      []
    ) || [];

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onClose={() => setError("")} />;
  }

  if (!coffeeShop) {
    return (
      <ErrorMessage
        message="Coffee shop not found."
        onClose={() => setError("")}
      />
    );
  }

  return (
    <div className="coffee-shop-details">
      <h2>{coffeeShop.name}</h2>
      <img
        src={coffeeShop.mainPhoto}
        alt={coffeeShop.name}
        className="coffee-shop-image"
      />
      <p className="coffee-shop-location">{coffeeShop.location}</p>
      {allPhotoUrls.length > 0 && (
        <div className="coffeeshop-photos-container">
          <h3>Photos</h3>
          <div className="coffeeshop-photos">
            {allPhotoUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Coffeeshop"
                className="coffeeshop-photo"
                onClick={() => openImageModal(url)}
              />
            ))}
          </div>
        </div>
      )}

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={currentImage}
        onClose={closeImageModal}
      />

      <div className="reviews">
        <h3 className="review-heading">Reviews</h3>
        {coffeeShop.reviews && coffeeShop.reviews.length > 0 ? (
          coffeeShop.reviews.map((review, index) => (
            <div key={review._id || index} className="review-card">
              <h3 className="review-username">{review.user.username}</h3>
              <h4 className="review-title">{review.title}</h4>
              <div className="review-details">
                <p>
                  <span>WiFi Speed:</span> {review.wifiSpeed}
                </p>
                <p>
                  <span>Seating:</span> {review.seating}
                </p>
                <p>
                  <span>Vibe:</span> {review.vibe}
                </p>
                <p>
                  <span>Food:</span> {review.food}
                </p>
                <p>
                  <span>Drink:</span> {review.drink}
                </p>
                <p>
                  <span>Noise Level:</span> {review.noisy}
                </p>
                {review.additionalComments && (
                  <p>
                    <span>Comments:</span> {review.additionalComments}
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
                        onClick={() => openImageModal(url)}
                      />
                    ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default CoffeeShop;
