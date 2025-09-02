import React, { useState } from "react";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import GameOverModal from "./components/GameOverModal";
import {
  initialBoard,
  isValidMove,
  isInCheck,
  hasAnyLegalMove,
  isOnlyKings,
} from "./lib/chessLogic";
import { toChessNotation } from "./lib/utils";
import "./styles/main.css";

export default function App() {
  const [board, setBoard] = useState(initialBoard());
  const [turn, setTurn] = useState("w");
  const [selected, setSelected] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [promotePawn, setPromotePawn] = useState(null);

  const handleMove = (from, to) => {
    if (gameStatus !== "playing") return;

    if (
      !isValidMove(board, from[0], from[1], to[0], to[1], turn)
    ) {
      setSelected(null);
      return;
    }

    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[from[0]][from[1]];
    const capturedPiece = newBoard[to[0]][to[1]];

    if (
      piece.type === "king" &&
      Math.abs(to[1] - from[1]) === 2
    ) {
      if (to[1] === 6) {

        const rook = newBoard[to[0]][7];
        newBoard[to[0]][5] = { ...rook, hasMoved: true };
        newBoard[to[0]][7] = null;
      } else if (to[1] === 2) {

        const rook = newBoard[to[0]][0];
        newBoard[to[0]][3] = { ...rook, hasMoved: true };
        newBoard[to[0]][0] = null;
      }
    }

    newBoard[to[0]][to[1]] = { ...piece, hasMoved: true };
    newBoard[from[0]][from[1]] = null;

    if (piece.type === "pawn" && (to[0] === 0 || to[0] === 7)) {
      setPromotePawn({ from, to });
      setBoard(newBoard);
      setSelected(null);
      return;
    }

    const nextTurn = turn === "w" ? "b" : "w";
    const nextPlayerHasLegalMoves = hasAnyLegalMove(newBoard, nextTurn);
    const nextPlayerInCheck = isInCheck(newBoard, nextTurn);

    if (nextPlayerInCheck && !nextPlayerHasLegalMoves) {

      setGameStatus("over");
      setBoard(newBoard);
      setSelected(null);
      setMoveHistory([
        ...moveHistory,
        `${toChessNotation(from[0], from[1])}${
          capturedPiece ? "x" : ""
        }${toChessNotation(to[0], to[1])}`,
      ]);
      return;
    } else if (!nextPlayerHasLegalMoves) {

      setGameStatus("stalemate");
    } else if (isOnlyKings(newBoard)) {

      setGameStatus("draw");
    }

    setBoard(newBoard);
    setSelected(null);
    setTurn(nextTurn);
    setMoveHistory([
      ...moveHistory,
      `${toChessNotation(from[0], from[1])}${
        capturedPiece ? "x" : ""
      }${toChessNotation(to[0], to[1])}`,
    ]);
  };

  const handlePromotion = (promotionType) => {
    const newBoard = board.map((row) => [...row]);
    const { from, to } = promotePawn;

    const pieceColor = to[0] === 0 ? "w" : "b";

    let promotedPiece = {};
    if (pieceColor === "w") {
      promotedPiece = {
        type: promotionType,
        color: "w",
        symbol: {
          queen: "♕",
          rook: "♖",
          bishop: "♗",
          knight: "♘",
        }[promotionType],
      };
    } else {
      promotedPiece = {
        type: promotionType,
        color: "b",
        symbol: {
          queen: "♛",
          rook: "♜",
          bishop: "♝",
          knight: "♞",
        }[promotionType],
      };
    }

    newBoard[to[0]][to[1]] = promotedPiece;
    setBoard(newBoard);
    setPromotePawn(null);
    setTurn(turn === "w" ? "b" : "w");
    setMoveHistory([
      ...moveHistory,
      `${toChessNotation(from[0], from[1])}${
        newBoard[to[0]][to[1]] ? "x" : ""
      }${toChessNotation(to[0], to[1])}=${promotedPiece.symbol}`,
    ]);
  };

  const handleRestart = () => {
    setBoard(initialBoard());
    setTurn("w");
    setSelected(null);
    setMoveHistory([]);
    setGameStatus("playing");
    setPromotePawn(null);
  };

  const winner = gameStatus === "over" ? turn : null;

  return (
    <div className="app-container">
      <h1>React Chess Game ♟️</h1>
      <div className="game-container">
        <Board
          board={board}
          turn={turn}
          selected={selected}
          setSelected={setSelected}
          handleMove={handleMove}
          isInteractive={gameStatus === "playing"}
        />
        <GameInfo turn={turn} moveHistory={moveHistory} gameStatus={gameStatus} />
      </div>
      <button data-testid="restart-button" onClick={handleRestart}>
        Restart Game
      </button>
      {(gameStatus !== "playing" || promotePawn) && (
        <GameOverModal
          winner={winner}
          status={gameStatus}
          onRestart={handleRestart}
          promotePawn={promotePawn}
          onPromote={handlePromotion}
        />
      )}
    </div>
  );
}