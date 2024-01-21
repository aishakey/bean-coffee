import axios from "axios";
import { jwtDecode } from "jwt-decode";

const getUserProfile = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }

  const decoded = jwtDecode(token);
  const userId = decoded.id;
  try {
    const response = await axios.get(
      `https://bean-coffee-4f8e78ba9adc.herokuapp.com/api/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("Failed to fetch user data:", error);
    return null;
  }
};

export { getUserProfile };
