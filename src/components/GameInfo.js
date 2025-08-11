import React from "react";
import { getStatusMessage } from "../lib/utils";

export default function GameInfo({ turn, moveHistory, gameStatus }) {
  const statusMessage = getStatusMessage(gameStatus, turn);

  return (
    <div className="game-info">
      <h3 data-testid="game-status">{statusMessage}</h3>
      <h4>Move History</h4>
      <ul className="move-list">
        {moveHistory.map((move, index) => (
          <li key={index} className="move-item">
            {Math.floor(index / 2) + 1}. {index % 2 === 0 ? "White" : "Black"}: {move}
          </li>
        ))}
      </ul>
    </div>
  );
}