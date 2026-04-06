import { render, screen } from "@testing-library/react";

import { Input } from "./input";

describe("Input", () => {
  it("forwards standard input props", () => {
    render(<Input aria-label="Company" defaultValue="Northwind" />);

    expect(screen.getByRole("textbox", { name: "Company" })).toHaveValue("Northwind");
  });
});
