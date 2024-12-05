/*
** The Gameboard represents the state of the board
** Each square holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    // Create a 2D array that will represent the state of the game board
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;
  
    // Add a token to the board at the specified row and column
    const addToken = (row, column, player) => {
      if (board[row][column].getValue() !== 0) {
        console.log("Invalid move! Cell already taken.");
        return false;
      }
  
      board[row][column].addToken(player);
      return true;
    };
  
    // This method will be used to print our board to the console.
    const printBoard = () => {
      const boardWithCellValues = board.map((row) =>
        row.map((cell) => cell.getValue())
      );
      console.log(boardWithCellValues.map(row => row.join(" | ")).join("\n---------\n"));
    };
  
    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, addToken, printBoard };
  }
  
  /*
  ** A Cell represents one "square" on the board and can have one of
  ** 0: no token is in the square,
  ** 1: Player One's token,
  ** 2: Player Two's token
  */
  
  function Cell() {
    let value = 0;
  
    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
      value = player;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addToken,
      getValue,
    };
  }
  
  /* 
  ** The GameController will be responsible for controlling the 
  ** flow and state of the game's turns, as well as whether
  ** anybody has won the game
  */
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: "X",
      },
      {
        name: playerTwoName,
        token: "O",
      },
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
  
    const getActivePlayer = () => activePlayer;
  
    const checkWinner = () => {
      const boardValues = board.getBoard().map((row) =>
        row.map((cell) => cell.getValue())
      );
  
      // Check rows, columns, and diagonals
      for (let i = 0; i < 3; i++) {
        // Check rows
        if (
          boardValues[i][0] !== 0 &&
          boardValues[i][0] === boardValues[i][1] &&
          boardValues[i][1] === boardValues[i][2]
        ) {
          return boardValues[i][0];
        }
  
        // Check columns
        if (
          boardValues[0][i] !== 0 &&
          boardValues[0][i] === boardValues[1][i] &&
          boardValues[1][i] === boardValues[2][i]
        ) {
          return boardValues[0][i];
        }
      }
  
      // Check diagonals
      if (
        boardValues[0][0] !== 0 &&
        boardValues[0][0] === boardValues[1][1] &&
        boardValues[1][1] === boardValues[2][2]
      ) {
        return boardValues[0][0];
      }
  
      if (
        boardValues[0][2] !== 0 &&
        boardValues[0][2] === boardValues[1][1] &&
        boardValues[1][1] === boardValues[2][0]
      ) {
        return boardValues[0][2];
      }
  
      return null;
    };
  
    const isTie = () => {
      const boardValues = board.getBoard().flat().map((cell) => cell.getValue());
      return boardValues.every((value) => value !== 0);
    };
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (row, column) => {
      // Draw a token for the current player
      console.log(
        `Drawing ${getActivePlayer().name}'s token into cell (${row}, ${column})...`
      );
  
      const moveSuccessful = board.addToken(row, column, getActivePlayer().token);
      if (!moveSuccessful) return;
  
      // Check for a winner or a tie
      const winner = checkWinner();
      if (winner) {
        board.printBoard();
        console.log(`Player ${winner} (${getActivePlayer().name}) wins!`);
        return;
      } else if (isTie()) {
        board.printBoard();
        console.log("It's a tie!");
        return;
      }
  
      // Switch player turn
      switchPlayerTurn();
      printNewRound();
    };
    
    // Initial play game message
   /* printNewRound();*/
  
    return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      checkWinner,
      isTie,
    };
  }
  
  function ScreenController() {
    let game;
    const playerOneInput = document.querySelector("#player-one-name");
    const playerTwoInput = document.querySelector("#player-two-name");
    const startButton = document.querySelector("#start-button");
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resultsDiv = document.querySelector('.results'); // Select the results div
  
    const updateScreen = () => {
      // Clear the board
      boardDiv.textContent = "";
  
      // Get the newest version of the board and active player
      const board = game.getBoard().map(row => row.map(cell => cell.getValue()));
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
  
      // Render board squares
      board.forEach((row, rowIndex) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        row.forEach((cellValue, colIndex) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          cellButton.textContent = cellValue === 0 ? "" : cellValue; // Display empty if value is 0
          cellButton.dataset.row = rowIndex; // Add row data attribute
          cellButton.dataset.column = colIndex; // Add column data attribute
          rowDiv.appendChild(cellButton);
        });
        boardDiv.appendChild(rowDiv);
      });
    };
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const cellButton = e.target;
      const selectedRow = cellButton.dataset.row;
      const selectedColumn = cellButton.dataset.column;
  
      // Make sure I've clicked a valid cell
      if (selectedRow === undefined || selectedColumn === undefined) return;
  
      // Convert data attributes to numbers
      const row = parseInt(selectedRow, 10);
      const column = parseInt(selectedColumn, 10);
  
      // Play the round
      game.playRound(row, column);
      updateScreen();
  
      // Check for a winner or tie after the round
      const winner = game.checkWinner(); // Use the checkWinner method from GameController
      const isTie = game.isTie(); // Use the isTie method from GameController
      if (winner) {
        resultsDiv.textContent = `🎉 ${game.getActivePlayer().name} wins with '${winner}'! 🎉`;
        boardDiv.removeEventListener("click", clickHandlerBoard); // Disable further clicks
      } else if (isTie) {
        resultsDiv.textContent = "It's a tie!";
        boardDiv.removeEventListener("click", clickHandlerBoard); // Disable further clicks
      } else {
        // Update the screen for the next turn
        updateScreen();
      }
    }
    const startGame = () => {
        const playerOneName = playerOneInput.value || "Player One";
        const playerTwoName = playerTwoInput.value || "Player Two";
    
        game = GameController(playerOneName, playerTwoName);
        resultsDiv.textContent = "";
        boardDiv.addEventListener("click", clickHandlerBoard);
        // Initial render
        updateScreen();
    };

    startButton.addEventListener("click", startGame);
  }
  
  
  ScreenController();