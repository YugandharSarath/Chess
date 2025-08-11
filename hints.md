### `Hints.md`

This document provides a guide to the project's structure and the core concepts behind its implementation. The project is modular, separating the UI, game logic, and state management into distinct files.

-----

### 🧠 General Approach

1.  **UI Components (`/src/components`)**: These files are responsible for the visual representation of the game. They render the chessboard, individual squares, and game information.

2.  **Game Logic (`/src/lib/chessLogic.js`)**: This is the "engine" of the game. It contains all the rules of chess and performs calculations to validate moves and determine the game state.

3.  **State Management (`/src/App.js`)**: This file acts as the central controller. It holds the game's state using React's `useState` hook and passes data and functions down to the UI components.

-----

### 🧩 Core Concepts with Code Snippets

#### 1\. State Management (`/src/App.js`)

`App.js` is the main component that manages the game's state. It uses `useState` to track the board, turn, and other game-related data. The `handleMove` function is the central game loop.

```javascript
import React, { useState } from "react";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import {
  initialBoard,
  isValidMove,
  isInCheck,
  hasAnyLegalMove,
} from "./lib/chessLogic";

export default function App() {
  const [board, setBoard] = useState(initialBoard());
  const [turn, setTurn] = useState("w");
  const [selected, setSelected] = useState(null);
  const [gameStatus, setGameStatus] = useState("playing");

  const handleMove = (from, to) => {
    // Check if the move is valid using the chessLogic function
    if (!isValidMove(board, from[0], from[1], to[0], to[1], turn)) {
      setSelected(null);
      return;
    }
    
    // ... logic for creating new board state ...

    // Update state after a successful move
    setBoard(newBoard);
    setSelected(null);
    setTurn(nextTurn);
    
    // Check for game-ending conditions
    const nextPlayerInCheck = isInCheck(newBoard, nextTurn);
    const nextPlayerHasLegalMoves = hasAnyLegalMove(newBoard, nextTurn);
    
    if (nextPlayerInCheck && !nextPlayerHasLegalMoves) {
        setGameStatus("over"); // Checkmate
    } else if (!nextPlayerHasLegalMoves) {
        setGameStatus("stalemate"); // Stalemate
    }
  };
  
  // ... rest of the component ...
}
```

-----

#### 2\. Game Logic (`/src/lib/chessLogic.js`)

This file contains the pure functions that enforce the rules of chess. The key functions are `isValidMove`, `isInCheck`, and the individual piece move functions.

```javascript
export function isValidMove(board, fromRow, fromCol, toRow, toCol, turn) {
  const piece = board[fromRow][fromCol];
  if (!piece || piece.color !== turn) return false;

  // Simulate the move on a temporary board
  const tempBoard = board.map((r) => [...r]);
  const movedPieceCopy = { ...piece };
  tempBoard[toRow][toCol] = movedPieceCopy;
  tempBoard[fromRow][fromCol] = null;

  // Check if the move leaves the king in check
  if (isInCheck(tempBoard, turn)) return false;

  // Use a switch statement to call the correct piece-specific logic
  switch (piece.type) {
    case "pawn":
      return pawnMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "rook":
      return rookMove(fromRow, fromCol, toRow, toCol, board);
    // ... other piece moves ...
    default:
      return false;
  }
}

export function isInCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const opponentColor = color === "w" ? "b" : "w";
  return isSquareAttacked(board, kingPos[0], kingPos[1], opponentColor);
}

export function isSquareAttacked(board, r, c, attackingColor) {
  // Directly check if any of the opponent's pieces can attack the square
  for (let fr = 0; fr < 8; fr++) {
    for (let fc = 0; fc < 8; fc++) {
      const piece = board[fr][fc];
      if (piece?.color === attackingColor) {
        let isAttacking = false;
        switch (piece.type) {
          case 'pawn': isAttacking = pawnMove(piece, fr, fc, r, c, board); break;
          case 'rook': isAttacking = rookMove(fr, fc, r, c, board); break;
          // ... other piece move checks ...
        }
        if (isAttacking) {
          return true;
        }
      }
    }
  }
  return false;
}
```

-----

#### 3\. UI and Interaction (`/src/components/Cell.js`)

The `Cell.js` component is responsible for rendering a single square. It receives props to determine its appearance and what piece to display.

```javascript
import React from "react";

export default function Cell({ piece, isSelected, isLegalMove, onClick }) {
  const cellClasses = `cell ${
    (row + col) % 2 === 0 ? "light" : "dark"
  } ${isSelected ? "selected" : ""} ${isLegalMove ? "legal-move" : ""}`;

  return (
    <div className={cellClasses} onClick={onClick}>
      {piece && (
        <span className={`piece ${piece.color}`}>{piece.symbol}</span>
      )}
    </div>
  );
}
```