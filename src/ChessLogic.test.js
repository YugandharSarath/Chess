import {
  isValidMove,
  isInCheck,
  hasAnyLegalMove,
  isOnlyKings,
} from "./chessLogic";
import initialBoard from "./initialBoard";

test("pawn can move forward", () => {
  const board = initialBoard.map((r) => [...r]);
  expect(isValidMove(board, 6, 4, 4, 4, "w")).toBe(true); // e2 → e4
});

test("rook blocked by pawn", () => {
  const board = initialBoard.map((r) => [...r]);
  expect(isValidMove(board, 7, 0, 4, 0, "w")).toBe(false);
});

test("detects check correctly", () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  board[0][4] = { type: "king", color: "b", symbol: "♚" };
  board[1][4] = { type: "queen", color: "w", symbol: "♕" };
  expect(isInCheck(board, "b")).toBe(true);
});

test("only kings remain", () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  board[0][4] = { type: "king", color: "b", symbol: "♚" };
  board[7][4] = { type: "king", color: "w", symbol: "♔" };
  expect(isOnlyKings(board)).toBe(true);
});

test("hasAnyLegalMove detects moves", () => {
  const board = initialBoard.map((r) => [...r]);
  expect(hasAnyLegalMove(board, "w")).toBe(true);
});

test("white can castle king-side", () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  board[7][4] = { type: "king", color: "w", symbol: "♔" };
  board[7][7] = { type: "rook", color: "w", symbol: "♖" };
  expect(isValidMove(board, 7, 4, 7, 6, "w")).toBe(true);
});

test("black can castle queen-side", () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  board[0][4] = { type: "king", color: "b", symbol: "♚" };
  board[0][0] = { type: "rook", color: "b", symbol: "♜" };
  expect(isValidMove(board, 0, 4, 0, 2, "b")).toBe(true);
});
