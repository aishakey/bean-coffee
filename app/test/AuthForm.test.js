import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthForm from "../src/components/AuthForm";

describe("AuthForm Component", () => {
  const mockSubmit = jest.fn();
  const fields = [
    {
      id: "username",
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
      required: true,
    },
    {
      id: "password",
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
      required: true,
    },
  ];
  const title = "Login";

  it("renders and allows form submission", () => {
    render(
      <AuthForm
        title={title}
        fields={fields}
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Proceed"));

    expect(mockSubmit).toHaveBeenCalled();
  });
});
