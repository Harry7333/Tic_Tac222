// var MyScriptP2P = (function () {

let isAI = false;
const statusDisplay = document.getElementById('status');
const countField = document.getElementById('numberTurns');
const startBox = document.getElementById('startBox');
const playField = document.getElementById('field');
const player1_name = document.getElementById('player1_name');
const player2_name = document.getElementById('player2_name');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

let gameActive = true;
let currentPlayer = 'X';
let gameState = [];
let cols, rows, steps, counter = 0;

const winnMessage = () => `${currentPlayer} Wins!`;
const nobodyWinsMessage = () => `!!Draw!!`;

// ----------------------------------  START GAME
let checkInput = (input) => 
{
    input = +input;
    input = (input < 3)
        ? 3
        : (input > 10)
            ? 10
            : input;


    return input;
}
let createMatrix = () => {
    let arr;
    for (let i = 0; i < rows; i++) {
        arr = [];
        for (let j = 0; j < cols; j++) {
            arr[j] = 0;
        }
        gameState[i] = arr;
    }
    console.log(gameState);
}
let drawField = () => {
    // let cellSize = window.innerHeight * 0.5 / cols;
    let cellSize = Math.min(window.innerWidth / cols, (window.innerHeight * 0.8) / rows);
    console.log(`cellSize ${cellSize}`);
    if(cellSize > 60)
        cellSize = 60;
    console.log(`cellSize ${cellSize}`);
    let box = document.createElement('div');
    box.setAttribute('id', 'container');

    let cell, row
    for (let i = 0; i < rows; i++) {
        row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < cols; j++) {
            cell = document.createElement('div');
            cell.setAttribute('id', `${i}_${j}`);
            cell.className = 'cell';
            cell.style.width =
                cell.style.height =
                    cell.style.lineHeight = `${cellSize}px`;
            cell.style.fontSize = `${cellSize / 26}em`;
            row.appendChild(cell);
        }
        box.appendChild(row);
    }
    playField.appendChild(box);
}

let handleStart = () => {

    document.getElementById('game-play-bottom').style.display = "block";
    player1.innerHTML = player1_name.value === '' ? 'Player \'X\'' : player1_name.value;
    player2.innerHTML = player2_name.value === '' ? 'Player \'O\'' : player2_name.value;
    cols = checkInput(document.getElementById('columns').value);
    rows = checkInput(document.getElementById('rows').value);
    console.log(`rows = ${rows}`);
    steps = checkInput(document.getElementById('steps').value);
    createMatrix();
    drawField();
    startBox.className = 'hidden';
    handlePlayerSwitch();
    document.querySelectorAll('.cell')
        .forEach(cell => cell.addEventListener('click', handleClick));
}

// ---------------------------------- WINNER ALGORITHM

let isWinning = (y, x) => {
    let winner = currentPlayer === 'X' ? 1 : 2,
        length = steps * 2 - 1,
        radius = steps - 1,
        countWinnMoves, winnCoordinates;

    // horizontal
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y, j = x - radius, k = 0; k < length; k++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }

    // vertical
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y - radius, j = x, k = 0; k < length; k++, i++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }

    // oblique to the right
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y - radius, j = x - radius, k = 0; k < length; k++, i++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }

    // oblique to the left
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y - radius, j = x + radius, k = 0; k < length; k++, i++, j--) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }
}

// ----------------------------------  GAME ONGOING

let handlePlayerSwitch = () => {
    if (currentPlayer === 'X') {
        player1.style.background = '#e0d9a9';
        player2.style.background = '#8f8f8f';
        player1.innerHTML = (player1_name.value != '') ? player1_name.value+" turn" : "Player 'X' Turn";
        player2.innerHTML = (player2_name.value != '') ? player2_name.value : "Player 'O'";

        if(isAI)
            player1.innerHTML = "AIIII "+player1_name.value;
    } else {
        player1.style.background = '#8f8f8f';
        player2.style.background = '#e0d9a9';
        player2.innerHTML = (player2_name.value != '') ? player2_name.value+" turn" : "Player 'O' Turn";
        player1.innerHTML = (player1_name.value != '') ? player1_name.value : "Player 'X'";


        if(isAI)
            player2.innerHTML = "AIIII "+player2_name.value;
    }
}

let isMovesLeft = () => {
    if (counter === cols * rows) 
    {
        statusDisplay.innerHTML = nobodyWinsMessage();
        //gameActive = false;
    }
}

let handleClick = (event) => {
    let clickedIndex = event.target.getAttribute('id').split('_');
    let i = +clickedIndex[0];
    let j = +clickedIndex[1];

    if (gameState[i][j] !== 0 || !gameActive)
        return;

    gameState[i][j] = (currentPlayer === 'X') ? 1 : 2;
    event.target.innerHTML = currentPlayer;
    countField.innerHTML = `${++counter}`;

    if(currentPlayer === 'X')
        event.target.style.background = '#efa7ac';
    else
        event.target.style.background = '#efd0a7';

    isMovesLeft();
    isWinning(i, j);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if(currentPlayer === 'O' && isAI)
    {
        setTimeout(aiMove, 500);
    }    
    // handlePlayerSwitch();

    // console.log(gameState)
}

// ----------------------------------  SHOW WINNING RESULTS

function winnActions(winner) {
    console.log(winner);

    gameActive = false;
    statusDisplay.innerHTML = winnMessage();
    statusDisplay.style.color = '#139de2';

    let cell;
    for (let i = 0; i < winner.length; i++) {
        cell = document.getElementById(`${winner[i][0]}_${winner[i][1]}`);
        cell.style.color = '#139de2';
    }
}

// ----------------------------------  RESET GAME
let handlePlayAgain = () => {
    gameActive = true;
    currentPlayer = 'X';
    counter = 0;
    countField.innerHTML = '0';
    statusDisplay.innerHTML = '';
    statusDisplay.style.color = 'black';
    player1.style.background = player2.style.background = '#8f8f8f';
    playField.removeChild(document.getElementById('container'));
    handleStart();
}

let handleRestart = () => {
    document.getElementById('game-play-bottom').style.display = "none";
    gameActive = true;
    currentPlayer = 'X';
    counter = 0;
    countField.innerHTML = '0';
    statusDisplay.innerHTML = '';
    statusDisplay.style.color = 'black';
    player1.style.background = player2.style.background = '#8f8f8f';
    player1_name.value = player2_name.value = '';
    player1.innerHTML = player2.innerHTML = '-';
    startBox.className = 'sidebar1';
    playField.removeChild(document.getElementById('container'));
}


let handleBack = () => {
    document.getElementById('main').style.display = "none";
}


document.querySelector('#start').addEventListener('click', handleStart);
document.querySelector('#playAgain').addEventListener('click', handlePlayAgain);
document.querySelector('#restart').addEventListener('click', handleRestart);
document.querySelector('#back').addEventListener('click', handleBack);


//---------------------------------------------------- AI LOGIC --------------------------------

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



// })();


