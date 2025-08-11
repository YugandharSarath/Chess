export function toChessNotation(row, col) {
  const file = String.fromCharCode(97 + col);
  const rank = 8 - row;
  return `${file}${rank}`;
}

export function getStatusMessage(gameStatus, turn) {
  if (gameStatus === "playing") {
    return `${turn === "w" ? "White" : "Black"} to move`;
  }
  return "Game Over";
}

export function getWinnerMessage(winner, status) {
  if (status === "draw") return "Draw: Only kings remain";
  if (status === "stalemate") return "Draw by stalemate";
  if (winner === "w") return "White wins by checkmate!";
  if (winner === "b") return "Black wins by checkmate!";
  return "Game Over";
}