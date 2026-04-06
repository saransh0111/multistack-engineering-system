import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

describe("Button", () => {
  it("renders children and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Ship</Button>);

    await user.click(screen.getByRole("button", { name: "Ship" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
