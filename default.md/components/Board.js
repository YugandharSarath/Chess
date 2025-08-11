import React from "react";
import Cell from "./Cell";
import { isValidMove } from "../lib/chessLogic";

export default function Board({ board, turn, selected, setSelected, handleMove, isInteractive }) {
  // 🏁 TASK: Handle what happens when a user clicks on a cell
  const handleCellClick = (r, c) => {
    if (!isInteractive) return;

    // 1. If a piece is already selected:
    //    - Clicking it again should deselect
    //    - Clicking another square should try to move
    // 2. If no piece is selected:
    //    - Only select if it belongs to the current player's turn
  };

  return (
    <div className="board" data-testid="board">
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            row={r}
            col={c}
            piece={cell}
            // 🏁 TASK: Highlight if the cell is a valid move destination
            isHighlighted={false} 
            // 🏁 TASK: Mark as selected if this is the chosen square
            isSelected={false}
            onClick={() => handleCellClick(r, c)}
          />
        ))
      )}
    </div>
  );
}
