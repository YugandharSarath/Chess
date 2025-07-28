
---

## ✅ Solution – Full React Chess Game

### 1. **Approach**

We implement a minimal chess engine in React:

1. **State Management**

   * `board`: 8×8 matrix holding piece objects `{type, color, symbol}` or `null`.
   * `turn`: Tracks `"w"` or `"b"`.
   * `selected`: Coordinates of the currently selected piece.
   * `moveHistory`: Array of human-readable move strings.
   * `status`: Current UI message.
   * `gameOver` / `winner`: Used for modal and stopping further play.

2. **Move Handling**

   * On cell click:

     * If selecting → mark the piece.
     * If destination → validate with `isValidMove()`.
   * Clone the board (`map`) before mutation.
   * Handle:

     * **Pawn Promotion**
     * **Self-check Prevention**

3. **Game End Detection**

   * After each move:

     * If `isInCheck(nextTurn)` and `!hasAnyLegalMove(nextTurn)` → checkmate.
     * If `!isInCheck(nextTurn)` and `!hasAnyLegalMove(nextTurn)` → stalemate.
     * If `isOnlyKings()` → insufficient material → draw.
   * Set `gameOver = true` and show modal.

4. **UI**

   * Chessboard grid of 64 cells.
   * Sidebar for moves and status.
   * Modal on game end.

---

### 2. **Edge Cases**

| Case                   | Handling                                |
| ---------------------- | --------------------------------------- |
| Pawn promotion         | Prompts user, updates piece type/symbol |
| Checkmate vs stalemate | Checked after each move                 |
| Self-check moves       | Blocked immediately                     |
| Re-clicking piece      | Cancels selection                       |
| Post-game clicks       | Disabled when `gameOver = true`         |

---

### 3. **Code**

```jsx
import React, { useState } from "react";
import "./ChessBoard.css";
import initialBoard from "./initialBoard";
import {
  isValidMove,
  isInCheck,
  hasAnyLegalMove,
  isOnlyKings,
} from "./chessLogic";

function indexToSquare(row, col) {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return files[col] + (8 - row);
}

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState("White to move");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const promotePawn = (pieceColor) => {
    const choice = window.prompt(
      "Promote pawn to: queen, rook, bishop, knight",
      "queen"
    );
    let newType = "queen";
    let newSymbol = pieceColor === "w" ? "♕" : "♛";

    if (choice) {
      switch (choice.toLowerCase()) {
        case "rook": newType = "rook"; newSymbol = pieceColor === "w" ? "♖" : "♜"; break;
        case "bishop": newType = "bishop"; newSymbol = pieceColor === "w" ? "♗" : "♝"; break;
        case "knight": newType = "knight"; newSymbol = pieceColor === "w" ? "♘" : "♞"; break;
        default: newType = "queen"; newSymbol = pieceColor === "w" ? "♕" : "♛";
      }
    }
    return { type: newType, color: pieceColor, symbol: newSymbol };
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;

    const piece = board[row][col];

    if (selected) {
      const [fromRow, fromCol] = selected;
      const movingPiece = board[fromRow][fromCol];

      if (movingPiece && movingPiece.color === turn) {
        if (isValidMove(board, fromRow, fromCol, row, col, turn)) {
          const newBoard = board.map((r) => [...r]);

          newBoard[row][col] = movingPiece;
          newBoard[fromRow][fromCol] = null;

          // Pawn Promotion
          if (
            movingPiece.type === "pawn" &&
            ((movingPiece.color === "w" && row === 0) ||
              (movingPiece.color === "b" && row === 7))
          ) {
            newBoard[row][col] = promotePawn(movingPiece.color);
          }

          // Prevent illegal self-check
          if (isInCheck(newBoard, turn)) {
            setSelected(null);
            return;
          }

          // Update move history
          const fromSq = indexToSquare(fromRow, fromCol);
          const toSq = indexToSquare(row, col);
          const moveNum = Math.floor(moveHistory.length / 2) + 1;
          setMoveHistory([...moveHistory, `${moveNum}. ${fromSq}-${toSq}`]);

          // Determine next turn
          const nextTurn = turn === "w" ? "b" : "w";

          // Game end checks
          const check = isInCheck(newBoard, nextTurn);
          const legal = hasAnyLegalMove(newBoard, nextTurn);

          if (check && !legal) {
            setStatus(`${turn === "w" ? "White" : "Black"} wins by checkmate`);
            setWinner(turn === "w" ? "White" : "Black");
            setGameOver(true);
          } else if (!check && !legal) {
            setStatus("Draw by stalemate");
            setWinner("Draw");
            setGameOver(true);
          } else if (isOnlyKings(newBoard)) {
            setStatus("Draw: Only kings remain");
            setWinner("Draw");
            setGameOver(true);
          } else {
            setStatus(nextTurn === "w" ? "White to move" : "Black to move");
          }

          setBoard(newBoard);
          setTurn(nextTurn);
        }
      }
      setSelected(null);
    } else {
      if (piece && piece.color === turn) {
        setSelected([row, col]);
      }
    }
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setSelected(null);
    setTurn("w");
    setMoveHistory([]);
    setStatus("White to move");
    setGameOver(false);
    setWinner("");
  };

  return (
    <div style={{ display: "flex", gap: "20px", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="board">
          {board.map((row, rIndex) =>
            row.map((cell, cIndex) => {
              const isSelected =
                selected && selected[0] === rIndex && selected[1] === cIndex;

              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  className={`cell ${(rIndex + cIndex) % 2 === 0 ? "light" : "dark"} ${
                    isSelected ? "hovered" : ""
                  }`}
                  onClick={() => handleCellClick(rIndex, cIndex)}
                >
                  {cell ? cell.symbol : ""}
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={restartGame}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Restart Game
        </button>
      </div>

      <div
        style={{
          width: "200px",
          background: "#1e1e1e",
          padding: "12px",
          borderRadius: "8px",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>{status}</h2>
        <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Moves</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {moveHistory.map((move, i) => (
            <li
              key={i}
              style={{
                padding: "2px 0",
                borderBottom: "1px solid #333",
                fontSize: "14px",
              }}
            >
              {move}
            </li>
          ))}
        </ul>
      </div>

      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h1>{winner === "Draw" ? "Game Drawn" : `${winner} Wins!`}</h1>
            <button
              onClick={restartGame}
              style={{
                padding: "10px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 4. **Complexity**

* **Rendering:** `O(64)`
* **Move validation:** Constant time per piece.
* **Game end detection:** `O(64)`

---

