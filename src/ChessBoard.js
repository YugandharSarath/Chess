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

  const promotePawn = (pieceColor) => {
    const choice = window.prompt(
      "Promote pawn to: queen, rook, bishop, knight",
      "queen"
    );
    let newType = "queen";
    let newSymbol = pieceColor === "w" ? "♕" : "♛";

    if (choice) {
      switch (choice.toLowerCase()) {
        case "rook":
          newType = "rook";
          newSymbol = pieceColor === "w" ? "♖" : "♜";
          break;
        case "bishop":
          newType = "bishop";
          newSymbol = pieceColor === "w" ? "♗" : "♝";
          break;
        case "knight":
          newType = "knight";
          newSymbol = pieceColor === "w" ? "♘" : "♞";
          break;
        default:
          newType = "queen";
          newSymbol = pieceColor === "w" ? "♕" : "♛";
      }
    }

    return { type: newType, color: pieceColor, symbol: newSymbol };
  };

  const handleCellClick = (row, col) => {
    const piece = board[row][col];

    if (selected) {
      const [fromRow, fromCol] = selected;
      const movingPiece = board[fromRow][fromCol];

      if (movingPiece && movingPiece.color === turn) {
        if (isValidMove(board, fromRow, fromCol, row, col, turn)) {
          const newBoard = board.map((r) => [...r]);

          // Perform move
          newBoard[row][col] = movingPiece;
          newBoard[fromRow][fromCol] = null;

          // 🏰 Handle castling rook movement
          if (movingPiece.type === "king" && Math.abs(col - fromCol) === 2) {
            if (col === 6) {
              // King-side castling
              newBoard[row][5] = newBoard[row][7];
              newBoard[row][7] = null;
            } else if (col === 2) {
              // Queen-side castling
              newBoard[row][3] = newBoard[row][0];
              newBoard[row][0] = null;
            }
          }

          // Prevent illegal self-check
          if (isInCheck(newBoard, turn)) {
            setSelected(null);
            return;
          }

          // ♙ Pawn Promotion
          let promoted = false;
          let promoPiece = null;
          if (
            movingPiece.type === "pawn" &&
            ((movingPiece.color === "w" && row === 0) ||
              (movingPiece.color === "b" && row === 7))
          ) {
            promoPiece = promotePawn(movingPiece.color);
            newBoard[row][col] = promoPiece;
            promoted = true;
          }

          // Move notation
          const fromSq = indexToSquare(fromRow, fromCol);
          const toSq = indexToSquare(row, col);
          const moveNum = Math.floor(moveHistory.length / 2) + 1;
          let moveString = `${moveNum}. ${fromSq}-${toSq}`;

          if (promoted) {
            moveString += `=${promoPiece.type.charAt(0).toUpperCase()}`;
          }

          // Annotate castling in move history
          if (movingPiece.type === "king" && Math.abs(col - fromCol) === 2) {
            moveString += col === 6 ? " O-O" : " O-O-O";
          }

          setMoveHistory([...moveHistory, moveString]);
          setBoard(newBoard);

          // Next turn
          const nextTurn = turn === "w" ? "b" : "w";

          // Game End Checks
          if (
            isInCheck(newBoard, nextTurn) &&
            !hasAnyLegalMove(newBoard, nextTurn)
          ) {
            setStatus(`${turn === "w" ? "White" : "Black"} wins by checkmate`);
          } else if (
            !isInCheck(newBoard, nextTurn) &&
            !hasAnyLegalMove(newBoard, nextTurn)
          ) {
            setStatus("Draw by stalemate");
          } else if (isOnlyKings(newBoard)) {
            setStatus("Draw: Only kings remain");
          } else {
            setStatus(nextTurn === "w" ? "White to move" : "Black to move");
          }

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
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="board">
          {board.map((row, rIndex) =>
            row.map((cell, cIndex) => {
              const isSelected =
                selected && selected[0] === rIndex && selected[1] === cIndex;

              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  className={`cell ${
                    (rIndex + cIndex) % 2 === 0 ? "light" : "dark"
                  } ${isSelected ? "hovered" : ""}`}
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
          width: "220px",
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
    </div>
  );
}
