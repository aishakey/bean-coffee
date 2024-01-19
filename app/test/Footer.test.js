import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../src/components/Footer";
import "@testing-library/jest-dom";

describe("Footer Component", () => {
  it("renders the current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(`© ${currentYear} Bean. All rights reserved.`)
    ).toBeInTheDocument();
  });
});
