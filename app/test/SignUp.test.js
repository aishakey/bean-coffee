import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "../src/pages/SignUp";
import { AuthContext } from "../src/context/AuthContext";
import * as authService from "../src/services/authService";

jest.mock("../src/services/authService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("SignUp Component", () => {
  const mockSetIsAuthenticated = jest.fn();

  beforeEach(() => {
    render(
      <AuthContext.Provider
        value={{ setIsAuthenticated: mockSetIsAuthenticated }}
      >
        <SignUp />
      </AuthContext.Provider>
    );
  });

  it("should allow a user to sign up", async () => {
    authService.registerUser.mockResolvedValue(true);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /proceed/i }));

    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalledWith(
        "John Doe",
        "johndoe",
        "john@example.com",
        "Password123!"
      );
    });
  });
});
