import React, { useContext, useState } from "react";
import AuthForm from "../components/AuthForm";
import { signInFields } from "../components/AuthFields";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useFormSubmission from "../hooks/useFormSubmission";

const SignUp = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  const { isSubmitting, startSubmitting, stopSubmitting } = useFormSubmission();

  const signUpFields = [
    {
      id: "name",
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      label: "Name",
      required: true,
    },
    {
      id: "username",
      name: "username",
      type: "text",
      placeholder: "Enter your username",
      label: "Username",
      required: true,
    },
    ...signInFields,
  ];

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    const { name, username, email, password } = event.target.elements;

    let errors = {};

    // Name validation
    if (!name.value.trim()) {
      errors.name = "Name is required";
    } else if (!/^[a-zA-Z ]+$/.test(name.value.trim())) {
      errors.name = "Name can only contain letters and spaces";
    }

    // Username validation
    if (!username.value.trim()) {
      errors.username = "Username is required";
    } else if (username.value.length < 3 || username.value.length > 20) {
      errors.username = "Username must be between 3 and 20 characters";
    } else if (!/^\w+$/.test(username.value)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.value.trim())) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (password.value.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/.test(password.value)
    ) {
      errors.password =
        "Password must include uppercase, lowercase, numbers, and symbols";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    startSubmitting();

    try {
      const success = await registerUser(
        name.value,
        username.value,
        email.value,
        password.value
      );

      if (success) {
        setIsAuthenticated(true);
        navigate("/profile");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("An error occurred during registration.");
    } finally {
      stopSubmitting();
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      fields={signUpFields}
      onSubmit={handleSignUpSubmit}
      isSubmitting={isSubmitting}
      validationErrors={validationErrors}
    />
  );
};

export default SignUp;
