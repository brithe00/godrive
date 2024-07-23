import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@mui/material/useMediaQuery", () => jest.fn());

describe("Navbar", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockReturnValue(null); // Default to logged out state
  });

  test("renders logo with correct text", () => {
    render(<Navbar />);
    expect(screen.getByText("GOD")).toBeInTheDocument();
    expect(screen.getByText("RIVE")).toBeInTheDocument();
  });

  test("displays login and register buttons when user is not logged in", () => {
    render(<Navbar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("displays user menu when logged in", () => {
    (useSelector as jest.Mock).mockReturnValue({
      email: "test@example.com",
      pictureUrl: "test.jpg",
    });
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: /account of current user/i })
    ).toBeInTheDocument();
  });

  test("clicking login button navigates to login page", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("clicking register button navigates to register page", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Register"));
    expect(mockRouter.push).toHaveBeenCalledWith("/register");
  });

  test("clicking search trips button navigates to search page", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Search Trips"));
    expect(mockRouter.push).toHaveBeenCalledWith("/trips/search");
  });
});
