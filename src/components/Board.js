import React from "react";
import Cell from "./Cell";
import { isValidMove } from "../lib/chessLogic";

export default function Board({ board, turn, selected, setSelected, handleMove, isInteractive }) {
  const handleCellClick = (r, c) => {
    if (!isInteractive) return;

    if (selected) {
      if (selected[0] === r && selected[1] === c) {
        setSelected(null);
        return;
      }
      handleMove(selected, [r, c]);
    } else {
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        setSelected([r, c]);
      }
    }
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
            isHighlighted={selected && isValidMove(board, selected[0], selected[1], r, c, turn)}
            isSelected={selected?.[0] === r && selected?.[1] === c}
            onClick={() => handleCellClick(r, c)}
          />
        ))
      )}
    </div>
  );
}