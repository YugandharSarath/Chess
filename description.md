## ♟️ React Chess Game

### 👨‍🎓 Problem Statement

Build a **two-player chess game** using React that adheres to all standard rules. The application must feature a full 8×8 board, validate all legal moves, handle special conditions like check and checkmate, and track the game's progress.

---

### ✅ Requirements

1.  **Board and Pieces**: Create a standard 8×8 grid with all chess pieces in their initial positions. White pieces should be on the bottom, and Black on the top.

2.  **Move Validation**: Implement comprehensive logic to ensure each piece moves according to standard chess rules (Pawn, Rook, Knight, Bishop, Queen, King).

3.  **Turn-Based Gameplay**: The game must start with White, and players must take alternating turns. An invalid move should not change the turn.

4.  **Special Rules & Game State**:
    * **Check & Checkmate**: Detect when a king is in check. A checkmate occurs when a king is in check and has no legal moves to escape.
    * **Stalemate**: Declare a draw by stalemate if the current player is not in check but has no legal moves.
    * **Draw by Insufficient Material**: Recognize a draw when the only pieces remaining are the two kings.
    * **Pawn Promotion**: When a pawn reaches the opposite end of the board, prompt the player to promote it to a Queen, Rook, Bishop, or Knight.
    * **Castling**: Implement both king-side and queen-side castling, but only under the legal conditions (king and rook haven't moved, the path is clear, and the king doesn't move into or through check).

5.  **User Interface**:
    * Display a clear **game status** (e.g., "White to move", "Black wins by checkmate").
    * Maintain and show a **move history** in standard algebraic notation (e.g., `1. e4`, `1... e5`).
    * Present a **"Game Over" modal** with the final result.
    * Include a **"Restart Game"** button that resets the board, history, and status.

---

### ⚠️ Edge Cases & Constraints

* **Self-Check**: An essential rule to enforce is that any move that would leave the player's own king in check is illegal.
* **Non-Interactive Board**: After a game-ending condition (checkmate, stalemate, draw), the board must be non-interactive until the game is restarted.
* **Correct Notation**: The move history must accurately reflect the turn number and player.
* **Visuals**: The board must render exactly 64 squares and use chess symbols for the pieces.

---

### 🧪 Testability Requirements

To ensure the provided automated tests function correctly, your solution must include the following `data-testid` attributes on the specified components:

* **Board**: The main board container should have `data-testid="board"`.
* **Cells**: Each cell on the board must have a `data-testid` in the format `cell-{row}-{col}`, where `row` and `col` are their zero-indexed coordinates (e.g., `cell-0-0`, `cell-7-7`).
* **Restart Button**: The restart button should have `data-testid="restart-button"`.
* **Game Status**: The element displaying the game's current status (e.g., "White to move") should have `data-testid="game-status"`.
* **Game Over Modal**: The modal or container for the "Game Over" screen should have `data-testid="game-over-modal"`.
* **Winner Message**: The message inside the modal that declares the winner (e.g., "White wins by checkmate!") should have `data-testid="winner-message"`.