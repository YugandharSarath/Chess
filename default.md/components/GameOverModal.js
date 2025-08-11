import React from "react";
// 🏁 TASK: Import the helper function to get the winner message

export default function GameOverModal({ winner, status, onRestart, promotePawn, onPromote }) {
  const promotionTypes = ["queen", "rook", "bishop", "knight"];

  if (promotePawn) {
    // 🏁 TASK: Determine the piece color based on pawn position
    const pieceColor = ""; 
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
              <button key={type} onClick={() => { /* 🏁 TASK: call onPromote */ }}>
                {/* 🏁 TASK: Display correct symbol */}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🏁 TASK: Get the winner message based on winner and status
  const message = "";

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
