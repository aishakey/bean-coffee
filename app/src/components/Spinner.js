import React from "react";
import "./spinner.css";
import spinnerImg from "../assets/bean-logo.svg";

const Spinner = () => (
  <div className="spinner-container">
    <img src={spinnerImg} alt="Loading..." className="spinner" />
  </div>
);

export default Spinner;
