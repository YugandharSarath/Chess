
---

## ♟️ Chess Game

### 👨‍🎓 Problem Statement

Build a React-based chess game that allows **two players to play a full match** on a standard 8×8 board. The app should enforce legal chess rules, track moves, detect game-ending conditions, and provide clear status updates.

---

### ✅ Requirements

1. **Create a standard 8×8 chessboard** with all pieces placed in their initial positions.
2. Each piece must move only according to **standard chess rules** (pawns, rooks, bishops, knights, queens, kings).
3. Players must alternate turns (**White starts first**).
4. The app must:

   * Validate moves (no illegal or self-check moves allowed).
   * Track the move history in proper notation (e.g., `1. e2-e4`).
   * Detect **check, checkmate, and stalemate**.
   * Support **pawn promotion** (prompt for piece type).
   * End the game when:

     * One side is checkmated,
     * Stalemate occurs,
     * Or only kings remain.
5. Show a **"Game Over" modal** when the match ends.
6. Provide a **Restart Game** button to reset the board and move history.

---

### ⚠️ Edge Cases & Constraints

- Any move that would place your own king in check must be treated as illegal and should not be allowed.

- When a pawn reaches the last rank, the game must prompt the player to promote it to a queen, rook, bishop, or knight.

- If a checkmate occurs, the game should display either “White wins by checkmate” or “Black wins by checkmate” and prevent any further moves.

- If a stalemate happens, the game should display “Draw by stalemate.”

- If the board reaches a state where only the two kings remain, it should display “Draw: Only kings remain.”

- After the game ends, any clicks or move attempts should be ignored until the game is restarted.

- The move history must always follow standard chess notation, including proper numbering for each turn.

- The board must consistently render exactly 64 squares, each showing the correct piece symbols.       |

---

