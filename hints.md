
---

## 💡 Hints.md – Full React Chess Game

---

### 🧠 State Management

* Use `useState` to manage core pieces of game state:

  ```js
  const [board, setBoard] = useState(initialBoard());
  const [turn, setTurn] = useState("white");
  const [selected, setSelected] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [winner, setWinner] = useState(null);
  ```

---

### ♟️ Initial Board Setup

* Write a function like `initialBoard()` to return an 8×8 matrix with proper pieces placed (e.g., `"r"`, `"n"`, `"p"`, `"k"`).
* White should be at the **bottom rows (6, 7)**, and black at the **top (0, 1)**.

---

### 🧮 Valid Move Logic

* Write a separate helper:

  ```js
  function isValidMove(board, from, to, piece, turn) {
    // Implement logic for pawn, rook, bishop, knight, queen, king
    // Include special rules: first pawn move, captures, etc.
  }
  ```

* Use a dispatcher to determine move logic per piece:

  ```js
  switch (piece.toLowerCase()) {
    case "p": return validatePawnMove(...);
    case "r": return validateRookMove(...);
    ...
  }
  ```

---

### ♛ Check, Checkmate, and Stalemate Detection

* After each move:

  * Run `isInCheck(board, turn)` – does current player’s king face attack?
  * If yes and `hasAnyLegalMove(board, turn)` is `false`, it's **checkmate**.
  * If no check but no legal moves – **stalemate**.
  * If only 2 kings remain → **insufficient material**.

* Maintain a helper:

  ```js
  function hasAnyLegalMove(board, turn) {
    // Check all pieces of 'turn' and simulate their possible legal moves
  }
  ```

---

### ♚ Castling

* Check three things:

  1. Neither king nor rook has moved.
  2. All spaces between them are empty.
  3. King is not in check, and does not pass through or land in check.

* Track moved flags:

  ```js
  const [hasMoved, setHasMoved] = useState({
    whiteKing: false,
    whiteRookK: false,
    whiteRookQ: false,
    blackKing: false,
    blackRookK: false,
    blackRookQ: false
  });
  ```

* Update these flags after each move involving king/rook.

---

### 🧝‍♀️ Pawn Promotion

* When a pawn reaches the last rank (`row === 0` for white, `row === 7` for black), prompt:

  ```js
  const promoted = window.prompt("Promote to (q, r, b, n):", "q");
  ```

* Replace the pawn with the chosen piece (`Q`, `R`, `B`, `N`) of the current turn's color.

---

### 📜 Move History in Chess Notation

* Track moves like:

  ```js
  setMoveHistory((prev) => [
    ...prev,
    `${Math.floor(prev.length / 2) + 1}${turn === "black" ? "..." : "."} ${from}-${to}`
  ]);
  ```

* Display moves in a side panel or below the board.

---

### 💀 Game Over Handling

* When checkmate / stalemate / draw is detected:

  ```js
  setGameStatus("gameover");
  setWinner(whoWon); // "white", "black", or "draw"
  ```

* Render a modal:

  ```js
  if (gameStatus === "gameover") return <GameOverModal winner={winner} />
  ```

---

### 🔄 Restart Game

* Provide a button that resets everything:

  ```js
  const restartGame = () => {
    setBoard(initialBoard());
    setTurn("white");
    setSelected(null);
    setMoveHistory([]);
    setGameStatus("playing");
    setWinner(null);
  };
  ```

---

### ✅ Constraints Recap

* ❌ Don’t allow moves leaving the king in check.
* 🔒 Disable board interactivity after game over.
* ♟ Prompt for pawn promotion.
* 🎯 Only show **valid moves** and **valid highlights**.
* ♚ Ensure castling follows all rules.
* 📝 Always track and show legal notation like:

  ```

