import axios from "axios";

const API_BASE_URL = "https://bean-coffee-4f8e78ba9adc.herokuapp.com";

const getCoffeeShops = async (search = "", minRev = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/coffeeShops`, {
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
      `${API_BASE_URL}/api/coffeeShops/${coffeeShopId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching coffee shop details:", error);
    throw error;
  }
};

export { getCoffeeShops, getCoffeeShopDetails };
