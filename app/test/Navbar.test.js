import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../src/components/Navbar";
import { AuthContext } from "../src/context/AuthContext";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Navbar Component", () => {
  const mockLogoutUser = jest.fn();

  it("renders and interacts correctly for authenticated user", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{ isAuthenticated: true, logoutUser: mockLogoutUser }}
        >
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Sign Out"));
    expect(mockLogoutUser).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders correctly for unauthenticated user", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{ isAuthenticated: false, logoutUser: mockLogoutUser }}
        >
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
});
