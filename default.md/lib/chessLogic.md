// 🏁 TASK: Return the starting chess board setup
export function initialBoard() {
 return [
    [
      { type: "rook", color: "b", symbol: "♜", hasMoved: false },
      { type: "knight", color: "b", symbol: "♞" },
      { type: "bishop", color: "b", symbol: "♝" },
      { type: "queen", color: "b", symbol: "♛" },
      { type: "king", color: "b", symbol: "♚", hasMoved: false },
      { type: "bishop", color: "b", symbol: "♝" },
      { type: "knight", color: "b", symbol: "♞" },
      { type: "rook", color: "b", symbol: "♜", hasMoved: false },
    ],
    Array.from({ length: 8 }, () => ({
      type: "pawn",
      color: "b",
      symbol: "♟",
    })),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array.from({ length: 8 }, () => ({
      type: "pawn",
      color: "w",
      symbol: "♙",
    })),
    [
      { type: "rook", color: "w", symbol: "♖", hasMoved: false },
      { type: "knight", color: "w", symbol: "♘" },
      { type: "bishop", color: "w", symbol: "♗" },
      { type: "queen", color: "w", symbol: "♕" },
      { type: "king", color: "w", symbol: "♔", hasMoved: false },
      { type: "bishop", color: "w", symbol: "♗" },
      { type: "knight", color: "w", symbol: "♘" },
      { type: "rook", color: "w", symbol: "♖", hasMoved: false },
    ],
  ];
}

// 🏁 TASK: Check if a given move is valid for the current turn
export function isValidMove(board, fromRow, fromCol, toRow, toCol, turn) {
  // 1. Ensure there's a piece at fromRow/fromCol belonging to `turn`
  // 2. Ensure target square is empty or has opponent's piece
  // 3. Ensure move follows piece movement rules
  // 4. Ensure move doesn't leave player's king in check
  return false;
}

// Movement functions for each piece type — fill in their rules
export function pawnMove(piece, fr, fc, tr, tc, board) {
  return false;
}

export function rookMove(fr, fc, tr, tc, board) {
  return false;
}

export function bishopMove(fr, fc, tr, tc, board) {
  return false;
}

export function knightMove(fr, fc, tr, tc) {
  return false;
}

export function kingMove(fr, fc, tr, tc) {
  return false;
}

// 🏁 TASK: Check if castling is allowed
export function canCastle(board, color, fromRow, fromCol, toRow, toCol) {
  return false;
}

// 🏁 TASK: Check if a square is attacked by an opponent's piece
export function isSquareAttacked(board, r, c, attackingColor) {
  return false;
}

// 🏁 TASK: Check if a given color's king is in check
export function isInCheck(board, color) {
  return false;
}

// 🏁 TASK: Check if a given color has any legal move
export function hasAnyLegalMove(board, color) {
  return false;
}

// 🏁 TASK: Check for insufficient material (only kings left)
export function isOnlyKings(board) {
  return false;
}

// Helper — find king's position
function findKing(board, color) {
  return null;
}
