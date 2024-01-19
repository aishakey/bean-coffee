import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorMessage from "../src/components/ErrorMessage";

describe("ErrorMessage Component", () => {
  const mockOnClose = jest.fn();
  const message = "Error occurred";

  it("displays the error message and closes on button click", () => {
    render(<ErrorMessage message={message} onClose={mockOnClose} />);

    expect(screen.getByText(message)).toBeInTheDocument();

    fireEvent.click(screen.getByText("X"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
