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