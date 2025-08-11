import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import "@testing-library/jest-dom";

jest.setTimeout(30000);

describe("ChessBoard Component", () => {
  const getCell = (row, col) => screen.getByTestId(`cell-${row}-${col}`);

  beforeEach(() => {
    render(<App />);
  });

  const getPieceSymbol = (r, c) => {
    const cell = getCell(r, c);
    const pieceSpan = cell.querySelector('span');
    return pieceSpan ? pieceSpan.textContent : '';
  };

  const waitForPiece = async (r, c, symbol) => {
    await waitFor(() => {
      const cell = getCell(r, c);
      const pieceSpan = cell.querySelector('span');
      expect(pieceSpan).toHaveTextContent(symbol);
    }, { timeout: 5000 });
  };

  const waitForEmptyCell = async (r, c) => {
    await waitFor(() => {
      const cell = getCell(r, c);
      expect(cell).toBeEmptyDOMElement();
    }, { timeout: 5000 });
  };

  const clickMove = async (fromRow, fromCol, toRow, toCol) => {
    await userEvent.click(getCell(fromRow, fromCol));
    await userEvent.click(getCell(toRow, toCol));
  };

  test("renders chessboard with 64 squares", () => {
    const cells = screen.getAllByTestId(/cell-/);
    expect(cells).toHaveLength(64);
  });

  test("renders white and black pieces correctly", () => {
    expect(getCell(0, 0)).toHaveTextContent("♜"); 
    expect(getCell(7, 3)).toHaveTextContent("♕"); 
    expect(getCell(6, 0)).toHaveTextContent("♙"); 
  });

  test("selects and highlights a piece", async () => {
    const cell = getCell(6, 4); 
    await userEvent.click(cell);
    expect(cell).toHaveClass("selected");
  });

  test("makes a valid pawn move and updates board", async () => {
    await clickMove(6, 4, 4, 4); 
    await waitForPiece(4, 4, "♙");
    await waitForEmptyCell(6, 4);
    expect(screen.getByText("Black to move")).toBeInTheDocument();
  });

  test("does not allow invalid move (blocked pawn)", async () => {
    await clickMove(6, 4, 5, 5); 
    expect(getCell(6, 4)).toHaveTextContent("♙");
    expect(getCell(5, 5)).toBeEmptyDOMElement();
    expect(screen.getByText("White to move")).toBeInTheDocument(); 
  });

  test("updates move history after valid move", async () => {
    await clickMove(6, 4, 4, 4); 
    await waitFor(() => {

      expect(screen.getByText(/1\. White: e2e4/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test("restart button resets the game", async () => {
    await clickMove(6, 4, 4, 4);
    await waitForPiece(4, 4, "♙");
    await userEvent.click(screen.getByText("Restart Game"));
    await waitForEmptyCell(4, 4);
    expect(getCell(6, 4)).toHaveTextContent("♙");
    expect(screen.getByText("White to move")).toBeInTheDocument();
  });
});