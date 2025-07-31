import React, { useState } from "react";
import "./ChessBoard.css";

function initialBoard() {
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

// ===== Chess Logic (from chessLogic.js) =====

function isValidMove(board, fromRow, fromCol, toRow, toCol, turn) {
  const piece = board[fromRow][fromCol];
  if (!piece || piece.color !== turn) return false;
  const target = board[toRow][toCol];
  if (target && target.color === turn) return false;

  // Temporarily apply the move to a new board to check if it puts own king in check
  const tempBoard = board.map((r) => [...r]);
  const movedPieceCopy = { ...piece }; // Copy piece before moving to avoid issues with hasMoved

  tempBoard[toRow][toCol] = movedPieceCopy;
  tempBoard[fromRow][fromCol] = null;

  // Special handling for king's castling movement on tempBoard for check check
  if (piece.type === "king" && Math.abs(toCol - fromCol) === 2) {
    if (toCol === 6) { // Kingside
      const rook = tempBoard[fromRow][7];
      if (rook) {
        tempBoard[fromRow][5] = { ...rook };
        tempBoard[fromRow][7] = null;
      }
    } else if (toCol === 2) { // Queenside
      const rook = tempBoard[fromRow][0];
      if (rook) {
        tempBoard[fromRow][3] = { ...rook };
        tempBoard[fromRow][0] = null;
      }
    }
  }

  if (isInCheck(tempBoard, turn)) return false; // Cannot move into check

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

function pawnMove(piece, fr, fc, tr, tc, board) {
  const dir = piece.color === "w" ? -1 : 1;
  const startRow = piece.color === "w" ? 6 : 1;
  if (fc === tc && !board[tr][tc]) { // Forward move
    if (tr === fr + dir) return true; // Single step
    if (fr === startRow && tr === fr + 2 * dir && !board[fr + dir][fc]) { // Double step from start
      return true;
    }
  }
  // Capture move
  if (Math.abs(tc - fc) === 1 && tr === fr + dir && board[tr][tc] && board[tr][tc]?.color !== piece.color) {
    return true;
  }
  return false;
}

function rookMove(fr, fc, tr, tc, board) {
  if (fr !== tr && fc !== tc) return false; // Not straight
  const stepR = fr === tr ? 0 : tr > fr ? 1 : -1;
  const stepC = fc === tc ? 0 : tc > fc ? 1 : -1;
  let r = fr + stepR;
  let c = fc + stepC;
  while (r !== tr || c !== tc) {
    if (board[r][c]) return false; // Obstruction
    r += stepR;
    c += stepC;
  }
  return true;
}

function bishopMove(fr, fc, tr, tc, board) {
  if (Math.abs(fr - tr) !== Math.abs(fc - tc)) return false; // Not diagonal
  const stepR = tr > fr ? 1 : -1;
  const stepC = tc > fc ? 1 : -1;
  let r = fr + stepR;
  let c = fc + stepC;
  while (r !== tr && c !== tc) {
    if (board[r][c]) return false; // Obstruction
    r += stepR;
    c += stepC;
  }
  return true;
}

function knightMove(fr, fc, tr, tc) {
  const dr = Math.abs(fr - tr);
  const dc = Math.abs(fc - tc);
  return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
}

function kingMove(fr, fc, tr, tc) {
  return Math.abs(fr - tr) <= 1 && Math.abs(fc - tc) <= 1;
}

function canCastle(board, color, fromRow, fromCol, toRow, toCol) {
  const king = board[fromRow][fromCol];
  if (!king || king.type !== "king" || king.color !== color || king.hasMoved) return false; // King must not have moved

  const opponentColor = color === "w" ? "b" : "w";

  // Kingside Castling
  if (toCol === fromCol + 2) { // Target square for kingside castle (e.g., e1 to g1)
    const rook = board[fromRow][7];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved) return false; // Rook must not have moved

    // Squares between king and rook must be empty and not attacked
    // King's original square, the square it moves through, and the square it lands on must not be attacked
    const pathSquares = [[fromRow, fromCol], [fromRow, fromCol + 1], [fromRow, toCol]];
    for (const [r, c] of pathSquares) {
      if (isSquareAttacked(board, r, c, opponentColor)) {
        return false;
      }
    }
    if (board[fromRow][fromCol + 1] || board[fromRow][toCol]) return false; // Intermediate squares must be empty

    return true;
  }

  // Queenside Castling
  if (toCol === fromCol - 2) { // Target square for queenside castle (e.g., e1 to c1)
    const rook = board[fromRow][0];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved) return false; // Rook must not have moved

    // Squares between king and rook must be empty and not attacked
    // King's original square, the squares it moves through, and the square it lands on must not be attacked
    const pathSquares = [[fromRow, fromCol], [fromRow, fromCol - 1], [fromRow, fromCol - 2]]; // c1, d1 for king
    for (const [r, c] of pathSquares) {
      if (isSquareAttacked(board, r, c, opponentColor)) {
        return false;
      }
    }
    if (board[fromRow][fromCol - 1] || board[fromRow][fromCol - 2] || board[fromRow][fromCol - 3]) return false; // Intermediate squares must be empty (including b-file)

    return true;
  }

  return false;
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.type === "king" && board[r][c]?.color === color)
        return [r, c];
  return null;
}

function isSquareAttacked(board, row, col, byColor) {
  const opponentColor = byColor;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === opponentColor) {
        // Temporarily clear the target square if there's a piece on it
        const originalTargetPiece = board[row][col];
        board[row][col] = null;

        let canAttack = false;
        const tempBoardForAttackCheck = board.map(rowArr => [...rowArr]); // Deep copy for move validation

        if (piece.type === "pawn") {
          const dir = piece.color === "w" ? -1 : 1;
          if (Math.abs(c - col) === 1 && r + dir === row) {
            canAttack = true;
          }
        } else if (piece.type === "knight") {
          canAttack = knightMove(r, c, row, col);
        } else if (piece.type === "king") {
          canAttack = kingMove(r, c, row, col);
        } else if (piece.type === "rook") {
          canAttack = rookMove(r, c, row, col, tempBoardForAttackCheck);
        } else if (piece.type === "bishop") {
          canAttack = bishopMove(r, c, row, col, tempBoardForAttackCheck);
        } else if (piece.type === "queen") {
          canAttack = rookMove(r, c, row, col, tempBoardForAttackCheck) || bishopMove(r, c, row, col, tempBoardForAttackCheck);
        }

        // Restore the original piece to the target square
        board[row][col] = originalTargetPiece;

        if (canAttack) {
          return true;
        }
      }
    }
  }
  return false;
}

function isInCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const opponentColor = color === "w" ? "b" : "w";
  return isSquareAttacked(
    board,
    kingPos[0],
    kingPos[1],
    opponentColor
  );
}

function hasAnyLegalMove(board, color) {
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

function isOnlyKings(board) {
  let count = 0;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) if (board[r][c]) count++;
  return count === 2;
}

// ===== React Component =====

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard());
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState("White to move");

  const handleMove = (fr, fc, tr, tc) => {
    const piece = board[fr][fc];
    if (!piece || piece.color !== turn) {
        setSelected(null);
        return;
    }
    
    if (!isValidMove(board, fr, fc, tr, tc, turn)) {
      setSelected(null);
      return;
    }

    const newBoard = board.map((r) => [...r]);
    const movedPiece = { ...piece, hasMoved: true };

    newBoard[tr][tc] = movedPiece;
    newBoard[fr][fc] = null;

    // Handle Castling (Rook movement) after king moves
    if (piece.type === "king" && Math.abs(tc - fc) === 2) {
      if (tc === 6) { // Kingside castling
        const rook = newBoard[tr][7];
        if (rook) {
          newBoard[tr][5] = { ...rook, hasMoved: true };
          newBoard[tr][7] = null;
        }
      } else if (tc === 2) { // Queenside castling
        const rook = newBoard[tr][0];
        if (rook) {
          newBoard[tr][3] = { ...rook, hasMoved: true };
          newBoard[tr][0] = null;
        }
      }
    }

    // Promotion
    if (movedPiece.type === "pawn" && (tr === 0 || tr === 7)) {
      const promotionType = prompt("Promote to: queen/rook/bishop/knight", "queen")?.toLowerCase();
      const map = {
        queen: "♕♛",
        rook: "♖♜",
        bishop: "♗♝",
        knight: "♘♞",
      };
      const sym = map[promotionType || "queen"];
      newBoard[tr][tc] = {
        type: promotionType || "queen",
        color: movedPiece.color,
        symbol: piece.color === "w" ? sym[0] : sym[1],
        hasMoved: true
      };
    }

    const moveNotation = `${String.fromCharCode(97 + fc)}${8 - fr}-${
      String.fromCharCode(97 + tc) + (8 - tr)
    }`;
    setMoveHistory([...moveHistory, moveNotation]);
    setBoard(newBoard);

    const nextTurn = turn === "w" ? "b" : "w";
    setTurn(nextTurn);
    setSelected(null);

    // Check game status after the move
    if (isInCheck(newBoard, nextTurn) && !hasAnyLegalMove(newBoard, nextTurn)) {
      setStatus(`${turn === "w" ? "White" : "Black"} wins by checkmate`);
    } else if (!isInCheck(newBoard, nextTurn) && !hasAnyLegalMove(newBoard, nextTurn)) {
      setStatus("Draw by stalemate");
    } else if (isOnlyKings(newBoard)) {
      setStatus("Draw: Only kings remain");
    } else if (isInCheck(newBoard, nextTurn)) {
      setStatus(`${nextTurn === "w" ? "White" : "Black"} to move, in check`);
    }
    else {
      setStatus(`${nextTurn === "w" ? "White" : "Black"} to move`);
    }
  };

  const handleClick = (r, c) => {
    if (selected) {
      handleMove(selected[0], selected[1], r, c);
    } else if (board[r][c]?.color === turn) {
      setSelected([r, c]);
    } else {
      setSelected(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="board">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                data-testid={`cell-${r}-${c}`}
                className={`cell ${(r + c) % 2 === 0 ? "light" : "dark"} ${
                  selected?.[0] === r && selected?.[1] === c ? "hovered" : ""
                } ${
                    selected && isValidMove(board, selected[0], selected[1], r, c, turn) ? "possible-move" : ""
                }`}
                onClick={() => handleClick(r, c)}
                draggable={!!cell && cell.color === turn}
                onDragStart={(e) => {
                  if (cell && cell.color === turn) {
                    e.dataTransfer.setData(
                      "text/plain",
                      JSON.stringify({ fromRow: r, fromCol: c })
                    );
                  } else {
                    e.preventDefault();
                  }
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (selected && isValidMove(board, selected[0], selected[1], r, c, turn)) {
                        e.currentTarget.classList.add('drag-over-valid');
                    }
                }}
                onDragLeave={(e) => {
                    e.currentTarget.classList.remove('drag-over-valid');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over-valid');
                  const data = e.dataTransfer.getData("text/plain");
                  if (data) {
                      const { fromRow, fromCol } = JSON.parse(data);
                      handleMove(fromRow, fromCol, r, c);
                  }
                }}
              >
                {/* Apply piece color based on piece.color */}
                {cell && <span className={cell.color === 'w' ? 'piece-white' : 'piece-black'}>{cell.symbol}</span>}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => {
            setBoard(initialBoard());
            setSelected(null);
            setTurn("w");
            setMoveHistory([]);
            setStatus("White to move");
          }}
          style={{ marginTop: 10 }}
        >
          Restart Game
        </button>
      </div>
      <div style={{ minWidth: "180px" }}>
        <h3>{status}</h3>
        <h4>Move History</h4>
        <ul style={{ maxHeight: 'calc(8 * 60px - 80px)', overflowY: 'auto', listStyleType: 'none', padding: 0 }}>
          {moveHistory.map((move, i) => (
            <li key={i} style={{ padding: '2px 0', borderBottom: '1px solid #333' }}>
              {Math.ceil((i + 1) / 2)}.{i % 2 === 0 ? ' White: ' : ' Black: '}{move}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}