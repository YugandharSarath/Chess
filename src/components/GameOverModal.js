import React from "react";
import { getWinnerMessage } from "../lib/utils";

export default function GameOverModal({ winner, status, onRestart, promotePawn, onPromote }) {
  const promotionTypes = ["queen", "rook", "bishop", "knight"];

  if (promotePawn) {
    const pieceColor =
      promotePawn.from[0] === 0 ? "b" : "w";
    const pieceSymbols =
      pieceColor === "w"
        ? ["♕", "♖", "♗", "♘"]
        : ["♛", "♜", "♝", "♞"];

    return (
      <div className="modal-overlay" data-testid="game-over-modal">
        <div className="modal-content">
          <h2>Pawn Promotion</h2>
          <p>Choose a piece to promote your pawn to:</p>
          <div className="promotion-options">
            {promotionTypes.map((type, index) => (
              <button key={type} onClick={() => onPromote(type)}>
                {pieceSymbols[index]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const message = getWinnerMessage(winner, status);

  return (
    <div className="modal-overlay" data-testid="game-over-modal">
      <div className="modal-content">
        <h2>Game Over</h2>
        <p data-testid="winner-message">{message}</p>
        <button onClick={onRestart}>Restart Game</button>
      </div>
    </div>
  );
}