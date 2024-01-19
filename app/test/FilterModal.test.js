import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterModal from "../src/components/FilterModal";

describe("FilterModal Component", () => {
  const mockOnClose = jest.fn();
  const mockUpdateFilters = jest.fn();
  const currentFilters = { searchTerm: "coffee", minReviews: 3 };

  it("renders and interacts correctly", () => {
    render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        updateFilters={mockUpdateFilters}
        currentFilters={currentFilters}
      />
    );

    expect(
      screen.getByPlaceholderText("Minimum reviews...")
    ).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Minimum reviews..."), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByText("Apply"));

    expect(mockUpdateFilters).toHaveBeenCalledWith(
      currentFilters.searchTerm,
      "5"
    );
    expect(mockOnClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Clear"));
    expect(mockUpdateFilters).toHaveBeenCalledWith(
      currentFilters.searchTerm,
      "0"
    );
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});
