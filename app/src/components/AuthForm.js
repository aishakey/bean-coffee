import React from "react";
import PropTypes from "prop-types";
import coffeeBag from "../assets/coffee-bag.svg";
import bubbles from "../assets/bubbles.svg";
import "./authForm.css";

const AuthForm = ({
  title,
  fields,
  onSubmit,
  isSubmitting,
  validationErrors,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };
  return (
    <div className="auth-form-container">
      <div className="img-container">
        <img src={bubbles} className="bubbles" alt="bubbles" />
        <img
          src={coffeeBag}
          className="coffee-bag"
          alt="A bag of coffee beans"
        />
      </div>
      <div className="auth-card">
        <h1>{title}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <React.Fragment key={field.id}>
              <label htmlFor={field.id} className="form-label">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
              />
              {validationErrors && validationErrors[field.name] && (
                <div className="val-error-message">
                  {validationErrors[field.name]}
                </div>
              )}
            </React.Fragment>
          ))}
          <button
            type="submit"
            className={`submit-button ${isSubmitting ? "loading-btn" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Proceed"}
          </button>
        </form>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      label: PropTypes.string,
      required: PropTypes.bool,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  validationErrors: PropTypes.object,
};

export default AuthForm;
