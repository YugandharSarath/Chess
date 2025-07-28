
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

| Case                                 | What Should Happen                                                          |
| ------------------------------------ | --------------------------------------------------------------------------- |
| A move places your own king in check | The move must be blocked (illegal move).                                    |
| Pawn reaches the last rank           | Must prompt for promotion (queen, rook, bishop, or knight).                 |
| Checkmate scenario                   | Show `White wins by checkmate` or `Black wins by checkmate` and stop moves. |
| Stalemate                            | Show `Draw by stalemate`.                                                   |
| Only kings remain                    | Show `Draw: Only kings remain`.                                             |
| Click after game over                | Ignore further moves until restarted.                                       |
| Move history format                  | Must strictly follow standard notation with move numbers.                   |
| Board rendering                      | Must always show **exactly 64 cells** with proper piece symbols.            |

---

