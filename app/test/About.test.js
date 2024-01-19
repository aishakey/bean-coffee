import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import About from "../src/pages/About";

describe("About Component", () => {
  it("renders the about page content", () => {
    render(<About />);

    const coffeeBeanImage = screen.getByAltText("Coffee Bean");
    const speechBoxImage = screen.getByAltText("Speech Box");
    expect(coffeeBeanImage).toBeInTheDocument();
    expect(speechBoxImage).toBeInTheDocument();

    const textContent = screen.getByText(
      /Bean was created out of love for coffee/i
    );
    expect(textContent).toBeInTheDocument();
  });
});
