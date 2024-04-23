import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    }

    const handleAuthExpired = () => {
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      navigate("/signin");
    };

    document.addEventListener("auth-token-expired", handleAuthExpired);
    setIsLoading(false);

    return () => {
      document.removeEventListener("auth-token-expired", handleAuthExpired);
    };
  }, [navigate]);

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
