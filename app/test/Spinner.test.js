import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Spinner from "../src/components/Spinner";

describe("Spinner Component", () => {
  it("renders the spinner image", () => {
    render(<Spinner />);
    const spinnerImage = screen.getByAltText("Loading...");
    expect(spinnerImage).toBeInTheDocument();
    expect(spinnerImage).toHaveClass("spinner");
  });
});
