var game = new Phaser.Game(300, 400, Phaser.AUTO, '', { preload: preload, create: create });

var board;
// var currentPlayer = "X"; // Player starts first
var cells = [];
var gameOver = false;

function preload() {}

function create() {
    game.stage.backgroundColor = "#ffffff";
    board = ["", "", "", "", "", "", "", "", ""]; // Empty board

    drawGrid(); // Draws Tic-Tac-Toe grid
    createCells(); // Creates clickable board cells

    // Restart button
    var restartButton = game.add.text(90, 320, "Restart", {
        font: "30px Arial",
        fill: "#FF0000",
        backgroundColor: "#DDD"
    });
    restartButton.inputEnabled = true;
    restartButton.events.onInputDown.add(restartGame);
}

// Draw Grid Lines
function drawGrid() {
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(5, 0x000000, 1);

    // Vertical lines
    graphics.moveTo(100, 0);
    graphics.lineTo(100, 300);
    graphics.moveTo(200, 0);
    graphics.lineTo(200, 300);

    // Horizontal lines
    graphics.moveTo(0, 100);
    graphics.lineTo(300, 100);
    graphics.moveTo(0, 200);
    graphics.lineTo(300, 200);
}

// Create Clickable Cells (Now using Buttons)
function createCells() {
    for (var i = 0; i < 9; i++) {
        var x = (i % 3) * 100;
        var y = Math.floor(i / 3) * 100;

        // Create button for each cell
        var cell = game.add.button(x, y, null, makeMove, this);
        cell.width = 100;
        cell.height = 100;
        cell.index = i; // Store index in button
        cells.push(cell);

        // Add text on top of the button
        var text = game.add.text(x + 50, y + 50, "", {
            font: "40px Arial",
            fill: "#000",
            align: "center"
        });
        text.anchor.set(0.5);
        cell.text = text; // Store reference to text object
    }
}

// Handle user move
function makeMove(button) {
    if (!gameOver && board[button.index] === "") {
        board[button.index] = "X";
        button.text.text = "X"; // Update text on button

        if (checkWinner(board, "X")) {
            alert("You Win!");
            gameOver = true;
            return;
        }

        if (!board.includes("")) {
            alert("It's a Draw!");
            gameOver = true;
            return;
        }

        // AI's turn after user move
        setTimeout(aiMove, 500);
    }
}

// AI Move using Minimax Algorithm
function aiMove() {
    if (gameOver) return;

    let bestMove = minimax(board, "O").index;
    if (bestMove !== undefined) {
        board[bestMove] = "O";
        cells[bestMove].text.text = "O"; // Update button text

        if (checkWinner(board, "O")) {
            alert("You Lost!");
            gameOver = true;
            return;
        }

        if (!board.includes("")) {
            alert("Draw!");
            gameOver = true;
        }
    }
}

// Minimax Algorithm
function minimax(newBoard, player) {
    const emptyCells = newBoard.map((cell, i) => (cell === "" ? i : null)).filter(i => i !== null);

    if (checkWinner(newBoard, "X")) return { score: -10 };
    if (checkWinner(newBoard, "O")) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i of emptyCells) {
        let move = { index: i };
        newBoard[i] = player;
        let result = minimax(newBoard, player === "O" ? "X" : "O");
        move.score = result.score;
        newBoard[i] = ""; // Reset move

        moves.push(move);
    }

    return player === "O"
        ? moves.reduce((best, move) => (move.score > best.score ? move : best), { score: -Infinity })
        : moves.reduce((best, move) => (move.score < best.score ? move : best), { score: Infinity });
}

// Check Winner Function
function checkWinner(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];
    return winPatterns.some(pattern => pattern.every(i => board[i] === player));
}

// Restart Game Function
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => (cell.text.text = ""));
    gameOver = false;
}
