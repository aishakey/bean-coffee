import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const getCoffeeShops = async (search = "", minRev = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coffeeShops`, {
      params: { location: search, minReviews: minRev },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    throw error;
  }
};

const getCoffeeShopDetails = async (coffeeShopId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/coffeeShops/${coffeeShopId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching coffee shop details:", error);
    throw error;
  }
};

export { getCoffeeShops, getCoffeeShopDetails };
