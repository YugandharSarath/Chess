export function isValidMove(board, fromRow, fromCol, toRow, toCol, turn) {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const target = board[toRow][toCol];
  if (target && target.color === turn) return false; // can't capture own piece

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
  const dir = piece.color === "w" ? -1 : 1; // white moves up, black moves down
  const startRow = piece.color === "w" ? 6 : 1;

  // Move forward
  if (fc === tc && !board[tr][tc]) {
    if (tr === fr + dir) return true;
    if (fr === startRow && tr === fr + 2 * dir && !board[fr + dir][fc]) {
      return true;
    }
  }

  // Capture
  if (Math.abs(tc - fc) === 1 && tr === fr + dir && board[tr][tc]) {
    return true;
  }

  return false;
}

function rookMove(fr, fc, tr, tc, board) {
  if (fr !== tr && fc !== tc) return false;

  if (fr === tr) {
    // Horizontal move
    const step = tc > fc ? 1 : -1;
    for (let c = fc + step; c !== tc; c += step) {
      if (board[fr][c]) return false; // path blocked
    }
    return true;
  } else {
    // Vertical move
    const step = tr > fr ? 1 : -1;
    for (let r = fr + step; r !== tr; r += step) {
      if (board[r][fc]) return false;
    }
    return true;
  }
}

function bishopMove(fr, fc, tr, tc, board) {
  if (Math.abs(tr - fr) !== Math.abs(tc - fc)) return false;

  const rowStep = tr > fr ? 1 : -1;
  const colStep = tc > fc ? 1 : -1;

  let r = fr + rowStep;
  let c = fc + colStep;

  while (r !== tr && c !== tc) {
    if (board[r][c]) return false; // path blocked
    r += rowStep;
    c += colStep;
  }
  return true;
}

function knightMove(fr, fc, tr, tc) {
  const dr = Math.abs(tr - fr);
  const dc = Math.abs(tc - fc);
  return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
}

function kingMove(fr, fc, tr, tc) {
  const dr = Math.abs(tr - fr);
  const dc = Math.abs(tc - fc);
  return dr <= 1 && dc <= 1;
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (
        board[r][c] &&
        board[r][c].type === "king" &&
        board[r][c].color === color
      ) {
        return [r, c];
      }
    }
  }
  return null;
}

function isSquareAttacked(board, row, col, byColor) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === byColor) {
        if (isValidMove(board, r, c, row, col, byColor)) {
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
  return isSquareAttacked(
    board,
    kingPos[0],
    kingPos[1],
    color === "w" ? "b" : "w"
  );
}

export function hasAnyLegalMove(board, color) {
  for (let fr = 0; fr < 8; fr++) {
    for (let fc = 0; fc < 8; fc++) {
      const piece = board[fr][fc];
      if (piece && piece.color === color) {
        for (let tr = 0; tr < 8; tr++) {
          for (let tc = 0; tc < 8; tc++) {
            if (isValidMove(board, fr, fc, tr, tc, color)) {
              const tempBoard = board.map((r) => [...r]);
              tempBoard[tr][tc] = piece;
              tempBoard[fr][fc] = null;
              if (!isInCheck(tempBoard, color)) {
                return true;
              }
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
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]) count++;
    }
  }
  return count === 2; // only two kings remain
}

function canCastle(board, color, fromRow, fromCol, toRow, toCol) {
  if (color === "w" && fromRow === 7 && fromCol === 4) {
    // King-side
    if (toRow === 7 && toCol === 6) {
      return (
        board[7][5] === null &&
        board[7][6] === null &&
        board[7][7]?.type === "rook" &&
        board[7][7]?.color === "w"
      );
    }
    // Queen-side
    if (toRow === 7 && toCol === 2) {
      return (
        board[7][1] === null &&
        board[7][2] === null &&
        board[7][3] === null &&
        board[7][0]?.type === "rook" &&
        board[7][0]?.color === "w"
      );
    }
  }

  if (color === "b" && fromRow === 0 && fromCol === 4) {
    // King-side
    if (toRow === 0 && toCol === 6) {
      return (
        board[0][5] === null &&
        board[0][6] === null &&
        board[0][7]?.type === "rook" &&
        board[0][7]?.color === "b"
      );
    }
    // Queen-side
    if (toRow === 0 && toCol === 2) {
      return (
        board[0][1] === null &&
        board[0][2] === null &&
        board[0][3] === null &&
        board[0][0]?.type === "rook" &&
        board[0][0]?.color === "b"
      );
    }
  }

  return false;
}
