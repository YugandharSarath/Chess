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

  // 🏁 TASK 1: Handle piece movement, castling, pawn promotion, and updating game state
  const handleMove = (from, to) => {
    if (gameStatus !== "playing") return;

    // 1. Check if move is valid using isValidMove()
    // 2. Update the board
    // 3. Handle special moves: castling, pawn promotion
    // 4. Update turn and move history
    // 5. Detect checkmate, stalemate, draw
  };

  // 🏁 TASK 2: Handle pawn promotion
  const handlePromotion = (promotionType) => {
    // 1. Replace pawn with chosen promotion piece
    // 2. Update board and turn
    // 3. Add promotion to move history
  };

  // 🏁 TASK 3: Restart the game
  const handleRestart = () => {
    // Reset all states to initial values
  };

  // Determine the winner if game is over
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
