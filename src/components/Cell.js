import React from "react";

export default function Cell({ row, col, piece, isHighlighted, isSelected, onClick }) {
  const isLight = (row + col) % 2 === 0;

  let cellClasses = `cell ${isLight ? "light" : "dark"}`;
  if (isSelected) cellClasses += " selected";
  if (isHighlighted) cellClasses += " possible-move";

  return (
    <div className={cellClasses} data-testid={`cell-${row}-${col}`} onClick={onClick}>
      {piece && <span className={`piece piece-${piece.color}`}>{piece.symbol}</span>}
    </div>
  );
}