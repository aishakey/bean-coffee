import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignIn from "../src/pages/SignIn";
import { AuthContext } from "../src/context/AuthContext";
import * as authService from "../src/services/authService";

jest.mock("../src/services/authService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("SignIn Component", () => {
  const mockSetIsAuthenticated = jest.fn();

  it("renders correctly", () => {
    render(
      <AuthContext.Provider
        value={{ setIsAuthenticated: mockSetIsAuthenticated }}
      >
        <SignIn />
      </AuthContext.Provider>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /proceed/i })
    ).toBeInTheDocument();
  });

  it("allows a user to sign in with correct credentials", async () => {
    authService.loginUser.mockResolvedValue(true);

    render(
      <AuthContext.Provider
        value={{ setIsAuthenticated: mockSetIsAuthenticated }}
      >
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /proceed/i }));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith(
        "john@example.com",
        "Password123!"
      );
      expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
    });
  });

  it("displays validation errors for incorrect input", async () => {
    render(
      <AuthContext.Provider
        value={{ setIsAuthenticated: mockSetIsAuthenticated }}
      >
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /proceed/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 8 characters long")
      ).toBeInTheDocument();
    });
  });
});
