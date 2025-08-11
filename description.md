
---

## ♟️ React Chess Game

### 👨‍🎓 Problem Statement

Build a **two-player chess game** using React that enforces all standard chess rules. Your application should:

* Display a standard 8×8 chessboard with all pieces in their initial positions.
* Allow turn-based play starting with White.
* Validate all moves for each piece according to chess rules.
* Handle special cases like castling, pawn promotion, check, checkmate, stalemate, and draw by insufficient material.
* Maintain and display a move history.
* Show clear game status updates and game over modals.
* Include a restart button to reset the game.

---

### ✅ Functional Requirements

1. **Board and Pieces**

   * Display a grid of 8 rows × 8 columns.
   * Initialize pieces in standard starting positions with appropriate symbols.
   * White pieces should appear on the bottom; Black on top.

2. **Move Validation**

   * Ensure only legal moves can be made based on piece type and game state.
   * Prevent moves that put or leave the player's own king in check.
   * Implement castling rules (king-side and queen-side).
   * Allow pawn promotion when a pawn reaches the opponent's back rank.
   * Detect check, checkmate, stalemate, and draw by insufficient material.

3. **Gameplay Flow**

   * Alternate turns starting with White.
   * Clicking on a piece highlights legal moves.
   * Clicking a legal destination moves the piece.
   * Invalid moves do not change the turn.
   * After game over, disable further interaction until restart.

4. **User Interface**

   * Show current game status ("White to move", "Black wins by checkmate", etc.).
   * Display a move history list using algebraic notation.
   * Present a modal for game over conditions and pawn promotion.
   * Provide a restart button with `data-testid="restart-button"` to reset the game.

---

### ⚠️ Edge Cases & Constraints

* Enforce **self-check prevention**: moves that leave the king in check are illegal.
* After game over (checkmate, stalemate, draw), board interaction is disabled.
* Correctly handle **special moves**: castling, pawn promotion.
* Use standard chess symbols for pieces.
* Move history should update correctly after every move or promotion.
* Use proper React state and immutability for board updates.
* Maintain accessibility and usability.

---

### 🧪 Testability Requirements

Your components must include the following `data-testid` attributes for automated testing:

* Board container: `data-testid="board"`
* Each cell: `data-testid="cell-{row}-{col}"` (0-indexed)
* Restart button: `data-testid="restart-button"`
* Game status text: `data-testid="game-status"`
* Game over modal container: `data-testid="game-over-modal"`
* Winner message inside modal: `data-testid="winner-message"`

---

### 📁 Provided Code Structure (for reference)

* `App.js`: Main game state and logic management.
* `Board.js`: Renders the chessboard and handles cell clicks.
* `Cell.js`: Renders individual cells and pieces.
* `GameInfo.js`: Displays game status and move history.
* `GameOverModal.js`: Shows game over or pawn promotion modals.
* `chessLogic.js`: Contains move validation and game state helper functions.
* `utils.js`: Utility functions for notation and status messages.
* `styles/main.css`: Styling for the game.

---

### 🎯 What You Should Focus On

* Correctness of chess rules enforcement.
* Clean, readable React code with proper state management.
* Handling special cases and game end conditions gracefully.
* User-friendly interactions including piece selection and move highlighting.

---

