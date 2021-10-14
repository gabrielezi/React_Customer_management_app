import React from "react";
import { render, screen } from "@testing-library/react";
import { Layout } from "./containers/Layout/Layout";

test("renders learn react link", () => {
  render(<Layout />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
