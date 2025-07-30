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

  const handleMove = (fromRow, fromCol, toRow, toCol) => {
    const movingPiece = board[fromRow][fromCol];

    if (!movingPiece || movingPiece.color !== turn) return;

    if (!isValidMove(board, fromRow, fromCol, toRow, toCol, turn)) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;

    // Handle castling
    if (movingPiece.type === "king" && Math.abs(toCol - fromCol) === 2) {
      if (toCol === 6) {
        newBoard[toRow][5] = newBoard[toRow][7];
        newBoard[toRow][7] = null;
      } else if (toCol === 2) {
        newBoard[toRow][3] = newBoard[toRow][0];
        newBoard[toRow][0] = null;
      }
    }

    // Prevent illegal move into check
    if (isInCheck(newBoard, turn)) return;

    let promoted = false;
    let promoPiece = null;
    if (
      movingPiece.type === "pawn" &&
      ((movingPiece.color === "w" && toRow === 0) ||
        (movingPiece.color === "b" && toRow === 7))
    ) {
      promoPiece = promotePawn(movingPiece.color);
      newBoard[toRow][toCol] = promoPiece;
      promoted = true;
    }

    // Move notation
    const fromSq = indexToSquare(fromRow, fromCol);
    const toSq = indexToSquare(toRow, toCol);
    const moveNum = Math.floor(moveHistory.length / 2) + 1;
    let moveString = `${moveNum}. ${fromSq}-${toSq}`;

    if (promoted) {
      moveString += `=${promoPiece.type.charAt(0).toUpperCase()}`;
    }

    if (movingPiece.type === "king" && Math.abs(toCol - fromCol) === 2) {
      moveString += toCol === 6 ? " O-O" : " O-O-O";
    }

    setMoveHistory([...moveHistory, moveString]);
    setBoard(newBoard);

    const nextTurn = turn === "w" ? "b" : "w";

    if (isInCheck(newBoard, nextTurn) && !hasAnyLegalMove(newBoard, nextTurn)) {
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
    setSelected(null);
  };

  const handleCellClick = (row, col) => {
    if (selected) {
      const [fromRow, fromCol] = selected;
      handleMove(fromRow, fromCol, row, col);
    } else if (board[row][col]?.color === turn) {
      setSelected([row, col]);
    } else {
      setSelected(null);
    }
  };

  const handleDrop = (e, toRow, toCol) => {
    const fromRow = parseInt(e.dataTransfer.getData("fromRow"));
    const fromCol = parseInt(e.dataTransfer.getData("fromCol"));
    handleMove(fromRow, fromCol, toRow, toCol);
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
        <div className="board" role="grid">
          {board.map((row, rIndex) =>
            row.map((cell, cIndex) => {
              const isSelected =
                selected &&
                selected[0] === rIndex &&
                selected[1] === cIndex;

              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                   role="gridcell"
                  className={`cell ${
                    (rIndex + cIndex) % 2 === 0 ? "light" : "dark"
                  } ${isSelected ? "hovered" : ""}`}
                  onClick={() => handleCellClick(rIndex, cIndex)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, rIndex, cIndex)}
                >
                  {cell && (
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("fromRow", rIndex);
                        e.dataTransfer.setData("fromCol", cIndex);
                      }}
                      style={{ cursor: "grab" }}
                    >
                      {cell.symbol}
                    </div>
                  )}
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