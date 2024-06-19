import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/userService";
import "./userProfile.css";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import userImg from "../assets/userImg.svg";

const UserProfile = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onClose={() => setError("")} />;
  }

  if (!userData) {
    return (
      <ErrorMessage message="User not found." onClose={() => setError("")} />
    );
  }

  const handleMyReviewsClick = () => {
    navigate("/my-reviews");
  };

  const handleCreateReviewClick = () => {
    navigate("/create-review");
  };

  return (
    <div className="profile-container">
      <div className="profile-photo">
        <img src={userImg} alt="User Placeholder" />
      </div>
      <div className="profile-info">
        <h2>{userData.name}</h2>
        <p>
          <span className="profile-span">email:</span> {userData.email}
        </p>
        <p>
<span className="profile-span">username: </span>

          {userData.username}
        </p>
      </div>
      <div className="profile-action-buttons">
        <button className="button-profile" onClick={handleMyReviewsClick}>
          my reviews
        </button>
        <button className="button-profile" onClick={handleCreateReviewClick}>
          add review
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
