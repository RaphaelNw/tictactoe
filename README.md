# tictactoe

1. Gameboard
The Gameboard module is responsible for maintaining the game's state (the 3x3 grid) and providing methods to interact with it.

How It Works

Data Structure:
board: A 2D array representing the Tic-Tac-Toe grid. Each cell is represented by a Cell object.

Methods:
getBoard(): Returns the current state of the board as a 2D array of Cell objects.
addToken(row, column, player): Adds the current player's token (X or O) to a specific cell if it's empty. Prevents invalid moves.
printBoard(): Prints the board's current state in a human-readable format to the console.

Why It's Important
Encapsulates all board-related logic.
Provides a clear interface (getBoard, addToken, printBoard) for other modules to interact with the board.


2. Cell
The Cell module represents a single square on the board.

How It Works
Data:
value: The current state of the cell (0 for empty, 1 for Player One, 2 for Player Two).

Methods:
addToken(player): Updates the cell's value to the given player's token.
getValue(): Retrieves the cell's current value.

Why It's Important
Simplifies the logic for individual cells by encapsulating their state and operations.
Allows Gameboard to manage a grid of reusable Cell objects.


3. GameController
The GameController module manages the flow of the game, including:

Player turns.
Checking for a winner or a tie.
Handling moves.
How It Works
Data:

board: The Gameboard instance managing the game's grid.
players: An array of two player objects, each with a name and token (X or O).
activePlayer: The player whose turn it currently is.
Methods:

getActivePlayer(): Returns the currently active player.
playRound(row, column): Handles a move for the active player:
Adds their token to the board.
Checks for a winner or tie.
Switches the turn to the next player if the game isn't over.
checkWinner(): Determines if there's a winner by checking rows, columns, and diagonals.
isTie(): Determines if the game is a tie (i.e., the board is full, and no winner exists).
Why It's Important
Centralizes game logic, making it easier to manage player turns and check game states.
Provides methods (playRound, checkWinner, isTie) for the ScreenController to use.



4. ScreenController
The ScreenController module manages the user interface (UI) and connects the game logic (GameController) with the DOM.

How It Works
DOM Elements:

playerTurnDiv: Displays the active player's turn.
boardDiv: Represents the game board in the UI.
resultsDiv: Displays the game results (e.g., winner or tie).
Methods:

updateScreen(): Updates the UI to reflect the current game state:
Clears and re-renders the board grid.
Updates the player's turn message.
clickHandlerBoard(e): Handles clicks on the board:
Determines which cell was clicked using data-row and data-column.
Calls playRound from GameController to process the move.
Updates the screen and checks for a winner or tie.
Why It's Important
Bridges the logic (GameController) with the UI.
Handles user input (clicks) and updates the UI dynamically.
Manages game state transitions visually.
5. Main Flow
The following steps summarize the overall flow:

Initialization:

ScreenController() initializes the game and UI.
updateScreen() renders the initial empty board and shows the first player's turn.
Player Moves:

A player clicks a cell, triggering clickHandlerBoard.
The row and column of the clicked cell are passed to playRound.
The game state is updated, and the screen is refreshed with updateScreen.
Win/Tie Detection:

After each move, checkWinner and isTie determine if the game has ended.
If there's a winner or tie, a message is displayed in resultsDiv, and further input is disabled.
Why This Design Works
Modular: Each component (board, cell, controller, UI) is independent, making the code easy to maintain and extend.
Separation of Concerns:
Gameboard handles grid state.
GameController handles game logic.
ScreenController handles UI updates.
User-Friendly: Clear and interactive UI with dynamic updates and meaningful messages.
Example Interaction
Player clicks a cell.
ScreenController processes the click and calls GameController.playRound.
The game logic determines the move's validity and updates the board.
GameController.checkWinner or GameController.isTie checks the game state.
The screen updates with the new board and active player's turn.
If the game ends, a result message is displayed, and input is disabled.