
---

## ♟️ Chess Game

### 👨‍🎓 Problem Statement

Build a **React-based chess game** that allows **two players** to play a full match on a standard 8×8 board. The app must enforce all legal chess rules, handle player turns, track move history in standard notation, detect check/checkmate/stalemate, and provide a clear game status with appropriate end-game handling.

---

### ✅ Requirements

1. **Create a standard 8×8 chessboard** with all pieces placed in their initial positions (White at bottom, Black at top).
2. Each piece must move only according to **standard chess rules**:

   * Pawn, Rook, Knight, Bishop, Queen, King.
3. **White always moves first**, followed by alternating turns.
4. The app must:

   * Validate all moves (illegal moves and self-checks must be prevented).
   * Track and display **move history in chess notation** (e.g., `1. e2-e4`).
   * Detect and handle:

     * **Check**
     * **Checkmate**
     * **Stalemate**
     * **Draw due to insufficient material** (e.g., only two kings remain)
   * Support **pawn promotion** with a prompt (choose: Queen, Rook, Bishop, Knight).
   * Support **castling** (both king-side and queen-side) under legal conditions:

     * Neither the king nor the castling rook has moved.
     * No pieces between them.
     * The king is not in check, does not pass through check, and does not end up in check.
5. **Show a "Game Over" modal** when the match ends with a message:

   * “White wins by checkmate”
   * “Black wins by checkmate”
   * “Draw by stalemate”
   * “Draw: Only kings remain”
6. Provide a **"Restart Game"** button that:

   * Resets the board to the initial state.
   * Clears move history and game status.
   * Allows new moves.

---

### ⚠️ Edge Cases & Constraints

* Any move that would place or leave the **player’s own king in check** must be treated as illegal and blocked.
* After a game-ending condition occurs (checkmate, stalemate, or draw), the board must become **non-interactive** until the user clicks **"Restart Game"**.
* Castling is only allowed under strict rules (see #4).
* When a **pawn reaches the last rank**, the app must **prompt the user to promote** it to Queen, Rook, Bishop, or Knight.
* The move history should always show **proper turn-based notation**:

  ```
  1. e2-e4
  1... e7-e5
  2. Nf3 Nc6
  ```
* The board must always render **exactly 64 squares** and reflect correct piece positions using chess symbols (♙, ♘, ♖, etc.).
* If only the two kings remain on the board, declare the game a **draw due to insufficient material**.

---

### 🧪 (Optional for Devs) Testing Expectations

* Unit tests for move validation per piece.
* Tests for check, checkmate, and stalemate conditions.
* Tests for castling and pawn promotion behavior.
* Tests for board reset and status updates.

---

