import React from "react";

export default function Cell({ row, col, piece, isHighlighted, isSelected, onClick }) {
  // 🏁 TASK: Determine if the square should be light or dark
  const isLight = false; // replace with check based on row+col

  // 🏁 TASK: Build the CSS class string based on:
  // - Light or dark square
  // - Selected square
  // - Highlighted possible move
  let cellClasses = "";

  return (
    <div
      className={cellClasses}
      data-testid={`cell-${row}-${col}`}
      onClick={onClick}
    >
      {/* 🏁 TASK: If there's a piece, render its symbol */}
    </div>
  );
}
