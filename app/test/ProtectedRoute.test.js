import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { AuthContext } from "../src/context/AuthContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: () => <div>Navigated to Sign In</div>,
}));

describe("ProtectedRoute Component", () => {
  const TestComponent = () => <div>Protected Content</div>;

  it("renders spinner when loading", () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, isLoading: true }}>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthContext.Provider>
    );
    expect(screen.getByAltText("Loading...")).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: true, isLoading: false }}>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthContext.Provider>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to sign in when not authenticated", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthContext.Provider
                value={{ isAuthenticated: false, isLoading: false }}
              >
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              </AuthContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Navigated to Sign In")).toBeInTheDocument();
  });
});
