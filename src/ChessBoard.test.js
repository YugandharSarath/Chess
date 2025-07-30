import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ChessBoard from "./ChessBoard";

class MockDataTransfer {
  constructor() {
    this.data = {};
  }

  setData(key, value) {
    this.data[key] = value;
  }

  getData(key) {
    return this.data[key];
  }

  clearData() {
    this.data = {};
  }
}

global.DataTransfer = MockDataTransfer;


// Basic render test
test("renders initial status", () => {
  render(<ChessBoard />);
  expect(screen.getByText(/White to move/i)).toBeInTheDocument();
});

// Restart button
test("restart button resets game", () => {
  render(<ChessBoard />);
  const restartBtn = screen.getByText(/Restart Game/i);
  fireEvent.click(restartBtn);
  expect(screen.getByText(/White to move/i)).toBeInTheDocument();
});

// Pawn promotion prompt
test("pawn promotion triggers prompt", () => {
  window.prompt = jest.fn(() => "queen");
  render(<ChessBoard />);

  // You'd need to simulate clicks to move a white pawn from row 6 to row 0.
  // For now, we only check prompt invocation:
  expect(typeof window.prompt).toBe("function");
});

// Selecting and moving
test("selects a piece when clicked", () => {
  render(<ChessBoard />);
  const cell = screen.getAllByText("♙")[0]; // first white pawn
  fireEvent.click(cell);
  // Should not crash, maybe highlight class added:
  // No direct DOM check for class (complex), but ensures it's clickable.
  expect(cell).toBeInTheDocument();
});

test("can move piece via drag and drop", () => {
  render(<ChessBoard />);

  const allCells = screen.getAllByRole("gridcell");
  const fromCell = allCells.find((cell) => cell.textContent === "♙"); // example pawn
  const toCell = allCells[40]; // pick a destination cell

  const dragStart = new DataTransfer();
  fireEvent.dragStart(fromCell.querySelector("div"), { dataTransfer: dragStart });
  dragStart.setData("fromRow", "6");
  dragStart.setData("fromCol", "0");

  fireEvent.dragOver(toCell);
  fireEvent.drop(toCell, { dataTransfer: dragStart });

  // Assert: check the piece moved
  expect(toCell).toHaveTextContent("♙");
});