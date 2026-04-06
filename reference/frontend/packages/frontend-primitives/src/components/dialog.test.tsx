import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";

describe("Dialog", () => {
  it("opens content from the trigger", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Launch review</DialogTitle>
          <DialogDescription>Dialog body</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Launch review")).toBeInTheDocument();
  });
});
