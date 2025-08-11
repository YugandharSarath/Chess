import React from "react";
// 🏁 TASK: Import the function to get the status message from utils

export default function GameInfo({ turn, moveHistory, gameStatus }) {
  // 🏁 TASK: Use the helper function to get the current status message
  const statusMessage = "";

  return (
    <div className="game-info">
      <h3 data-testid="game-status">{statusMessage}</h3>

      <h4>Move History</h4>
      <ul className="move-list">
        {/* 🏁 TASK: Map over moveHistory and render each move
            Format example: 1. White: e4
                            1. Black: e5 */}
      </ul>
    </div>
  );
}
