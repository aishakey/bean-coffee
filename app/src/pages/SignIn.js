import React, { useContext, useState } from "react";
import AuthForm from "../components/AuthForm";
import { signInFields } from "../components/AuthFields";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useFormSubmission from "../hooks/useFormSubmission";

const SignIn = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormSubmission();

  const handleSignInSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = event.target.elements;

    let errors = {};

    // Email validation
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.value.trim())) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (password.value.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    startSubmitting();

    try {
      if (await loginUser(email.value, password.value)) {
        setIsAuthenticated(true);
        navigate("/profile");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      alert("An error occurred during sign-in.");
    } finally {
      stopSubmitting();
    }
  };

  return (
    <AuthForm
      title="Sign In"
      fields={signInFields}
      onSubmit={handleSignInSubmit}
      isSubmitting={isSubmitting}
      validationErrors={validationErrors}
    />
  );
};

export default SignIn;
