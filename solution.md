 `App.js` 

```jsx
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

    // Handle Castling
    if (
      piece.type === "king" &&
      Math.abs(to[1] - from[1]) === 2
    ) {
      if (to[1] === 6) {
        // King-side castle
        const rook = newBoard[to[0]][7];
        newBoard[to[0]][5] = { ...rook, hasMoved: true };
        newBoard[to[0]][7] = null;
      } else if (to[1] === 2) {
        // Queen-side castle
        const rook = newBoard[to[0]][0];
        newBoard[to[0]][3] = { ...rook, hasMoved: true };
        newBoard[to[0]][0] = null;
      }
    }

    // Move the piece
    newBoard[to[0]][to[1]] = { ...piece, hasMoved: true };
    newBoard[from[0]][from[1]] = null;

    // Pawn Promotion check
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
      // Checkmate, the current player wins
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
      // Stalemate
      setGameStatus("stalemate");
    } else if (isOnlyKings(newBoard)) {
      // Draw by insufficient material
      setGameStatus("draw");
    }

    // Regular move, update board and turn
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

    // Correctly determine the pawn's color from the board
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
```



`Board.js` 

```jsx
import React from "react";
import Cell from "./Cell";
import { isValidMove } from "../lib/chessLogic";

export default function Board({ board, turn, selected, setSelected, handleMove, isInteractive }) {
  const handleCellClick = (r, c) => {
    if (!isInteractive) return;

    if (selected) {
      if (selected[0] === r && selected[1] === c) {
        setSelected(null);
        return;
      }
      handleMove(selected, [r, c]);
    } else {
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        setSelected([r, c]);
      }
    }
  };

  return (
    <div className="board" data-testid="board">
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            row={r}
            col={c}
            piece={cell}
            isHighlighted={selected && isValidMove(board, selected[0], selected[1], r, c, turn)}
            isSelected={selected?.[0] === r && selected?.[1] === c}
            onClick={() => handleCellClick(r, c)}
          />
        ))
      )}
    </div>
  );
}
```

`Cell.js` 

```jsx
import React from "react";

export default function Cell({ row, col, piece, isHighlighted, isSelected, onClick }) {
  const isLight = (row + col) % 2 === 0;

  let cellClasses = `cell ${isLight ? "light" : "dark"}`;
  if (isSelected) cellClasses += " selected";
  if (isHighlighted) cellClasses += " possible-move";

  return (
    <div className={cellClasses} data-testid={`cell-${row}-${col}`} onClick={onClick}>
      {piece && <span className={`piece piece-${piece.color}`}>{piece.symbol}</span>}
    </div>
  );
}
```


`GameInfo.js` 

```jsx
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
```



`GameOverModel.js` 

```jsx
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
```

 `Chesslogic.js` 

```jsx
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

export function isValidMove(board, fromRow, fromCol, toRow, toCol, turn) {
  const piece = board[fromRow][fromCol];
  if (!piece || piece.color !== turn) return false;
  const target = board[toRow][toCol];
  if (target && target.color === turn) return false;

  const tempBoard = board.map((r) => [...r]);
  const movedPieceCopy = { ...piece };

  tempBoard[toRow][toCol] = movedPieceCopy;
  tempBoard[fromRow][fromCol] = null;

  if (piece.type === "king" && Math.abs(toCol - fromCol) === 2) {
    if (toCol === 6) {
      const rook = tempBoard[fromRow][7];
      if (rook) {
        tempBoard[fromRow][5] = { ...rook };
        tempBoard[fromRow][7] = null;
      }
    } else if (toCol === 2) {
      const rook = tempBoard[fromRow][0];
      if (rook) {
        tempBoard[fromRow][3] = { ...rook };
        tempBoard[fromRow][0] = null;
      }
    }
  }

  if (isInCheck(tempBoard, turn)) return false;

  switch (piece.type) {
    case "pawn":
      return pawnMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "rook":
      return rookMove(fromRow, fromCol, toRow, toCol, board);
    case "bishop":
      return bishopMove(fromRow, fromCol, toRow, toCol, board);
    case "queen":
      return (
        rookMove(fromRow, fromCol, toRow, toCol, board) ||
        bishopMove(fromRow, fromCol, toRow, toCol, board)
      );
    case "knight":
      return knightMove(fromRow, fromCol, toRow, toCol);
    case "king":
      return (
        kingMove(fromRow, fromCol, toRow, toCol) ||
        canCastle(board, piece.color, fromRow, fromCol, toRow, toCol)
      );
    default:
      return false;
  }
}

export function pawnMove(piece, fr, fc, tr, tc, board) {
  const dir = piece.color === "w" ? -1 : 1;
  const startRow = piece.color === "w" ? 6 : 1;
  if (fc === tc && !board[tr][tc]) {
    if (tr === fr + dir) return true;
    if (fr === startRow && tr === fr + 2 * dir && !board[fr + dir][fc]) {
      return true;
    }
  }

  if (
    Math.abs(tc - fc) === 1 &&
    tr === fr + dir &&
    board[tr][tc] &&
    board[tr][tc]?.color !== piece.color
  ) {
    return true;
  }
  return false;
}

export function rookMove(fr, fc, tr, tc, board) {
  if (fr !== tr && fc !== tc) return false;
  const stepR = fr === tr ? 0 : tr > fr ? 1 : -1;
  const stepC = fc === tc ? 0 : tc > fc ? 1 : -1;
  let r = fr + stepR;
  let c = fc + stepC;
  while (r !== tr || c !== tc) {
    if (board[r][c]) return false;
    r += stepR;
    c += stepC;
  }
  return true;
}

export function bishopMove(fr, fc, tr, tc, board) {
  if (Math.abs(tr - fr) !== Math.abs(tc - fc)) return false;
  const stepR = tr > fr ? 1 : -1;
  const stepC = tc > fc ? 1 : -1;
  let r = fr + stepR;
  let c = fc + stepC;
  while (r !== tr || c !== tc) {
    if (board[r][c]) return false;
    r += stepR;
    c += stepC;
  }
  return true;
}

export function knightMove(fr, fc, tr, tc) {
  const rowDiff = Math.abs(tr - fr);
  const colDiff = Math.abs(tc - fc);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

export function kingMove(fr, fc, tr, tc) {
  return Math.abs(tr - fr) <= 1 && Math.abs(tc - fc) <= 1;
}

export function canCastle(board, color, fromRow, fromCol, toRow, toCol) {
  const king = board[fromRow][fromCol];
  if (!king || king.type !== "king" || king.color !== color || king.hasMoved)
    return false;

  const opponentColor = color === "w" ? "b" : "w";

  // King-side castle
  if (toCol === fromCol + 2) {
    const rook = board[fromRow][7];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved)
      return false;

    if (
      board[fromRow][fromCol + 1] ||
      board[fromRow][fromCol + 2]
    )
      return false;

    if (
      isSquareAttacked(board, fromRow, fromCol, opponentColor) ||
      isSquareAttacked(board, fromRow, fromCol + 1, opponentColor) ||
      isSquareAttacked(board, fromRow, fromCol + 2, opponentColor)
    )
      return false;

    return true;
  }

  // Queen-side castle
  if (toCol === fromCol - 2) {
    const rook = board[fromRow][0];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved)
      return false;

    if (
      board[fromRow][fromCol - 1] ||
      board[fromRow][fromCol - 2] ||
      board[fromRow][fromCol - 3]
    )
      return false;

    if (
      isSquareAttacked(board, fromRow, fromCol, opponentColor) ||
      isSquareAttacked(board, fromRow, fromCol - 1, opponentColor) ||
      isSquareAttacked(board, fromRow, fromCol - 2, opponentColor)
    )
      return false;

    return true;
  }

  return false;
}

export function isSquareAttacked(board, r, c, attackingColor) {
  for (let fr = 0; fr < 8; fr++) {
    for (let fc = 0; fc < 8; fc++) {
      const piece = board[fr][fc];
      if (piece?.color === attackingColor) {
        let isAttacking = false;
        switch (piece.type) {
          case 'pawn':
            isAttacking = pawnMove(piece, fr, fc, r, c, board);
            break;
          case 'rook':
            isAttacking = rookMove(fr, fc, r, c, board);
            break;
          case 'knight':
            isAttacking = knightMove(fr, fc, r, c);
            break;
          case 'bishop':
            isAttacking = bishopMove(fr, fc, r, c, board);
            break;
          case 'queen':
            isAttacking = rookMove(fr, fc, r, c, board) || bishopMove(fr, fc, r, c, board);
            break;
          case 'king':
            isAttacking = kingMove(fr, fc, r, c);
            break;
        }

        if (isAttacking) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isInCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const opponentColor = color === "w" ? "b" : "w";
  return isSquareAttacked(board, kingPos[0], kingPos[1], opponentColor);
}

export function hasAnyLegalMove(board, color) {
  for (let fr = 0; fr < 8; fr++) {
    for (let fc = 0; fc < 8; fc++) {
      const piece = board[fr][fc];
      if (piece?.color === color) {
        for (let tr = 0; tr < 8; tr++) {
          for (let tc = 0; tc < 8; tc++) {
            if (isValidMove(board, fr, fc, tr, tc, color)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

export function isOnlyKings(board) {
  let count = 0;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) if (board[r][c]) count++;
  return count === 2;
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece?.type === "king" && piece?.color === color) {
        return [r, c];
      }
    }
  }
  return null;
}
```

 `utils.js` 
 ```jsx
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
```

## styles/main.css

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #2c3e50;
  color: #ecf0f1;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background-color: #34495e;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

h1 {
  color: #f1c40f;
  margin-bottom: 0.5rem;
}

.game-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  border: 4px solid #34495e;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.cell {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.light {
  background-color: #ecf0f1;
}

.dark {
  background-color: #95a5a6;
}

.selected {
  background-color: #3498db !important;
}

.possible-move {
  position: relative;
}

.possible-move::after {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(52, 152, 219, 0.6);
}

.piece {
  font-size: 40px;
  line-height: 1;
}

.piece-w {
  color: #fff;
  text-shadow: 1px 1px 2px #000;
}

.piece-b {
  color: #34495e;
  text-shadow: 1px 1px 2px #fff;
}

.game-info {
  background-color: #2c3e50;
  border-radius: 8px;
  padding: 1rem;
  width: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.game-info h3, .game-info h4 {
  color: #f1c40f;
  text-align: center;
  margin: 0;
}

.move-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  max-height: 360px;
  overflow-y: auto;
}

.move-item {
  background-color: #34495e;
  border-bottom: 1px solid #7f8c8d;
  padding: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #34495e;
  color: #ecf0f1;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
}

button {
  background-color: #f1c40f;
  color: #2c3e50;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #f39c12;
}
```
