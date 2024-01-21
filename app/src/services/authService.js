import axios from "axios";

const BASE_URL = "https://bean-coffee-4f8e78ba9adc.herokuapp.com";

const instance = axios.create({
  baseURL: BASE_URL,
});

const loginUser = async (email, password) => {
  try {
    const response = await instance.post("/api/users/login", {
      email,
      password,
    });

    localStorage.setItem("authToken", response.data.token);

    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

const registerUser = async (name, username, email, password) => {
  try {
    const response = await instance.post("/api/users/register", {
      name,
      username,
      email,
      password,
    });

    localStorage.setItem("authToken", response.data.token);
    return true;
  } catch (error) {
    console.error("Registration failed:", error);
    return false;
  }
};

export { loginUser, registerUser };
