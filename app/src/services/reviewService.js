import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "https://bean-coffee-4f8e78ba9adc.herokuapp.com";

const getToken = () => {
  return localStorage.getItem("authToken");
};

const getUserReviews = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/api/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user reviews:", error);
    return [];
  }
};

const checkCoffeeShopExists = async (location) => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_BASE_URL}/api/reviews/exists`, {
      params: { location },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking coffee shop existence:", error);
    throw error;
  }
};

const uploadPhotos = async (photos) => {
  const token = getToken();
  const formData = new FormData();

  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/reviews/upload`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Error uploading photos");
    } else if (error.request) {
      console.error("No response:", error.request);
      throw new Error("No response from the server");
    } else {
      console.error("Error:", error.message);
      throw new Error("Error in uploading photos");
    }
  }
};

const submitReview = async (reviewData) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/reviews`,
      reviewData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Error submitting review");
    } else if (error.request) {
      console.error("No response:", error.request);
      throw new Error("No response from the server");
    } else {
      console.error("Error:", error.message);
      throw new Error("Error in submitting review");
    }
  }
};

const deleteReview = async (reviewId) => {
  const token = getToken();
  if (!token) {
    console.error("No token found");
    return false;
  }
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/reviews/${reviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: userId },
      }
    );
    if (response.status === 200 || response.status === 204) {
      return true;
    } else {
      console.error("Deletion was not successful:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return false;
  }
};

export {
  getUserReviews,
  uploadPhotos,
  submitReview,
  deleteReview,
  checkCoffeeShopExists,
};
