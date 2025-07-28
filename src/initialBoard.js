const initialBoard = [
  [
    { type: "rook", color: "b", symbol: "♜" },
    { type: "knight", color: "b", symbol: "♞" },
    { type: "bishop", color: "b", symbol: "♝" },
    { type: "queen", color: "b", symbol: "♛" },
    { type: "king", color: "b", symbol: "♚" },
    { type: "bishop", color: "b", symbol: "♝" },
    { type: "knight", color: "b", symbol: "♞" },
    { type: "rook", color: "b", symbol: "♜" },
  ],
  new Array(8).fill({ type: "pawn", color: "b", symbol: "♟" }),
  new Array(8).fill(null),
  new Array(8).fill(null),
  new Array(8).fill(null),
  new Array(8).fill(null),
  new Array(8).fill({ type: "pawn", color: "w", symbol: "♙" }),
  [
    { type: "rook", color: "w", symbol: "♖" },
    { type: "knight", color: "w", symbol: "♘" },
    { type: "bishop", color: "w", symbol: "♗" },
    { type: "queen", color: "w", symbol: "♕" },
    { type: "king", color: "w", symbol: "♔" },
    { type: "bishop", color: "w", symbol: "♗" },
    { type: "knight", color: "w", symbol: "♘" },
    { type: "rook", color: "w", symbol: "♖" },
  ],
];

export default initialBoard;
