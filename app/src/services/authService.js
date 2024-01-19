import axios from "axios";

const loginUser = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:5000/api/users/login", {
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
    const response = await axios.post(
      "http://localhost:5000/api/users/register",
      {
        name,
        username,
        email,
        password,
      }
    );
    localStorage.setItem("authToken", response.data.token);
    return true;
  } catch (error) {
    console.error("Registration failed:", error);
    return false;
  }
};

export { loginUser, registerUser };
