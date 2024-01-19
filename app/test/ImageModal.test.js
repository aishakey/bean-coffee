import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageModal from "../src/components/ImageModal";

describe("ImageModal Component", () => {
  const mockOnClose = jest.fn();
  const imageUrl = "test-image.jpg";

  it("renders the image modal when open", () => {
    render(
      <ImageModal isOpen={true} imageUrl={imageUrl} onClose={mockOnClose} />
    );

    expect(screen.getByAltText("Full Size")).toBeInTheDocument();
    expect(screen.getByAltText("Full Size")).toHaveAttribute("src", imageUrl);

    fireEvent.click(screen.getByAltText("Full Size"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not render when not open", () => {
    render(
      <ImageModal isOpen={false} imageUrl={imageUrl} onClose={mockOnClose} />
    );

    expect(screen.queryByAltText("Full Size")).not.toBeInTheDocument();
  });
});
