import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "../src/pages/UserProfile";
import { AuthContext } from "../src/context/AuthContext";
import { getUserProfile } from "../src/services/userService";
import { BrowserRouter } from "react-router-dom";

jest.mock("../src/services/userService", () => ({
  getUserProfile: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserProfile Component", () => {
  it("renders user profile data", async () => {
    getUserProfile.mockResolvedValue({
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ isAuthenticated: true }}>
          <UserProfile />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Username:/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });
  });
});
