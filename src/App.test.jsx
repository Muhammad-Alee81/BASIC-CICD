import { render, screen, fireEvent } from "@testing-library/react";
import App, { STAGES } from "./App.jsx";

describe("Landing page", () => {
  it("shows the headline", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/harbor does the rest/i);
  });

  it("renders every pipeline stage", () => {
    render(<App />);
    STAGES.forEach((s) => expect(screen.getByText(s.name)).toBeInTheDocument());
  });

  it("starts the pipeline when the button is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /run the pipeline/i }));
    expect(screen.getByRole("button", { name: /shipping/i })).toBeDisabled();
  });
});
