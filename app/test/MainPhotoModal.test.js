import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainPhotoModal from "../src/components/MainPhotoModal";

global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();

describe("MainPhotoModal Component", () => {
  const mockSetMainPhoto = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnGoToProfile = jest.fn();

  it("renders and interacts correctly", () => {
    const { rerender } = render(
      <MainPhotoModal
        isOpen={true}
        mainPhoto={null}
        setMainPhoto={mockSetMainPhoto}
        onConfirm={mockOnConfirm}
        onGoToProfile={mockOnGoToProfile}
      />
    );

    expect(
      screen.getByText(/since you're the first reviewer/i)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Pick New Photo"));
    expect(mockSetMainPhoto).not.toHaveBeenCalled(); // No photo selected yet

    const mockFile = new File([""], "test.jpg", { type: "image/jpeg" });
    rerender(
      <MainPhotoModal
        isOpen={true}
        mainPhoto={mockFile}
        setMainPhoto={mockSetMainPhoto}
        onConfirm={mockOnConfirm}
        onGoToProfile={mockOnGoToProfile}
      />
    );

    expect(screen.getByAltText("Main Preview")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
