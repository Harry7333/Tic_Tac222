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
let isAI = false; // Flag to track if AI mode is enabled

const winnMessage = () => `${currentPlayer} Wins!`;
const nobodyWinsMessage = () => `!!Draw!!`;

let checkInput = (input) => {
    input = +input;
    return Math.max(3, Math.min(10, input));
};

let createMatrix = () => {
    gameState = Array.from({ length: rows }, () => Array(cols).fill(0));
};

let drawField = () => {
    let cellSize = Math.min(window.innerWidth / cols, (window.innerHeight * 0.8) / rows);
    cellSize = Math.min(cellSize, 60);
    let box = document.createElement('div');
    box.setAttribute('id', 'container');

    for (let i = 0; i < rows; i++) {
        let row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.setAttribute('id', `${i}_${j}`);
            cell.className = 'cell';
            cell.style.width = cell.style.height = cell.style.lineHeight = `${cellSize}px`;
            cell.style.fontSize = `${cellSize / 26}em`;
            row.appendChild(cell);
        }
        box.appendChild(row);
    }
    playField.appendChild(box);
};

let handleStart = () => {
    document.getElementById('game-play-bottom').style.display = "block";
    player1.innerHTML = player1_name.value || 'Player X';
    player2.innerHTML = player2_name.value || 'Player O';
    cols = checkInput(document.getElementById('columns').value);
    rows = checkInput(document.getElementById('rows').value);
    steps = checkInput(document.getElementById('steps').value);
    // isAI = true;

    createMatrix();
    drawField();
    startBox.className = 'hidden';
    handlePlayerSwitch();
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleClick));
};

let handlePlayerSwitch = () => {
    player1.style.background = currentPlayer === 'X' ? '#e0d9a9' : '#8f8f8f';
    player2.style.background = currentPlayer === 'O' ? '#e0d9a9' : '#8f8f8f';
    
    if (isAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 500); // AI makes a move with delay
    }
};

let isMovesLeft = () => {
    if (counter === cols * rows) {
        statusDisplay.innerHTML = nobodyWinsMessage();
        gameActive = false;
        sndDraw.play();
    }
};

/*
let handleClick = (event) => {
    if (!gameActive || (isAI && currentPlayer === 'O')) return;
    let [i, j] = event.target.getAttribute('id').split('_').map(Number);
    if (gameState[i][j] !== 0) return;

    makeMove(i, j);
    handlePlayerSwitch();
};

let makeMove = (i, j) => {
    gameState[i][j] = currentPlayer === 'X' ? 1 : 2;
    document.getElementById(`${i}_${j}`).innerHTML = currentPlayer;
    counter++;
    isWinning(i, j);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

let aiMove = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameState[i][j] === 0) {
                makeMove(i, j);
                handlePlayerSwitch();
                return;
            }
        }
    }
};
*/
let isWinning = (y, x) => {
    let player = currentPlayer === 'X' ? 1 : 2;
    let directions = [[0,1], [1,0], [1,1], [1,-1]];

    for (let [dy, dx] of directions) {
        let count = 1;
        for (let d = 1; d < steps; d++) {
            let ny = y + dy * d, nx = x + dx * d;
            if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && gameState[ny][nx] === player) {
                count++;
            } else break;
        }
        for (let d = 1; d < steps; d++) {
            let ny = y - dy * d, nx = x - dx * d;
            if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && gameState[ny][nx] === player) {
                count++;
            } else break;
        }
        if (count >= steps) {
            gameActive = false;
            statusDisplay.innerHTML = winnMessage();
            if(isSound)
            {    
                if(currentPlayer === 'X')
                    sndWin.play();
                else
                    sndLose.play();
            }    
            return;
        }
    }
    isMovesLeft();
};

let handlePlayAgain = () => {
    gameActive = true;
    currentPlayer = 'X';
    counter = 0;
    countField.innerHTML = '0';
    statusDisplay.innerHTML = '';
    playField.removeChild(document.getElementById('container'));
    handleStart();

    /*
gameActive = true;
    currentPlayer = 'X';
    counter = 0;
    countField.innerHTML = '0';
    statusDisplay.innerHTML = '';
    statusDisplay.style.color = 'black';
    player1.style.background = player2.style.background = '#8f8f8f';
    playField.removeChild(document.getElementById('container'));
    handleStart();
    */
};


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
let handleHome = () => {
    handleRestart();
    handleBack();
    destroyInfoScreen();
    isShowMenu = true;
}


document.querySelector('#start').addEventListener('click', handleStart);
document.querySelector('#playAgain').addEventListener('click', handlePlayAgain);
document.querySelector('#restart').addEventListener('click', handleRestart); // back from gameplay to config
document.querySelector('#back').addEventListener('click', handleBack);// back from config to info
document.querySelector('#home').addEventListener('click', handleHome);// gameplay to menu
//-------------------------- smarter AI ---------------------------------------

const aiMove = () => {
    if (!gameActive || currentPlayer !== 'O') return;
    
    // AI tries to win
    let move = findBestMove(2);
    if (!move) {
        // AI tries to block opponent's win
        move = findBestMove(1);
    }
    if (!move) {
        // AI picks the best available strategic move
        move = pickStrategicMove();
    }
    if (move) {
        makeMove(move[0], move[1]);
    }
};

const findBestMove = (playerValue) => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameState[i][j] === 0) {
                gameState[i][j] = playerValue;
                if (checkWin(i, j, playerValue)) {
                    gameState[i][j] = 0;
                    return [i, j];
                }
                gameState[i][j] = 0;
            }
        }
    }
    return null;
};

/*
if (checkWin(i, j, 2)) {  // AI can win
    return { i, j };
}
if (checkWin(i, j, 1)) {  // Block player from winning
    bestMove = { i, j };
}
*/
const checkWin = (i, j, playerValue) => {
    
    let length = steps * 2 - 1;
    let radius = steps - 1;
    let countWinnMoves;

    // Check horizontally
    countWinnMoves = 0;
    for (let x = j - radius; x <= j + radius; x++) {
        if (x >= 0 && x < cols && gameState[i][x] === playerValue) {
            countWinnMoves++;
            if (countWinnMoves === steps) return true;
        } else {
            countWinnMoves = 0;
        }
    }

    // Check vertically
    countWinnMoves = 0;
    for (let y = i - radius; y <= i + radius; y++) {
        if (y >= 0 && y < rows && gameState[y][j] === playerValue) {
            countWinnMoves++;
            if (countWinnMoves === steps) return true;
        } else {
            countWinnMoves = 0;
        }
    }

    // Check diagonally (top-left to bottom-right)
    countWinnMoves = 0;
    for (let x = j - radius, y = i - radius; x <= j + radius && y <= i + radius; x++, y++) {
        if (x >= 0 && x < cols && y >= 0 && y < rows && gameState[y][x] === playerValue) {
            countWinnMoves++;
            if (countWinnMoves === steps) return true;
        } else {
            countWinnMoves = 0;
        }
    }

    // Check diagonally (top-right to bottom-left)
    countWinnMoves = 0;
    for (let x = j + radius, y = i - radius; x >= j - radius && y <= i + radius; x--, y++) {
        if (x >= 0 && x < cols && y >= 0 && y < rows && gameState[y][x] === playerValue) {
            countWinnMoves++;
            if (countWinnMoves === steps) return true;
        } else {
            countWinnMoves = 0;
        }
    }

    return false;
};

const pickStrategicMove = () => {
    // Prefer center
    let center = [Math.floor(rows / 2), Math.floor(cols / 2)];
    if (gameState[center[0]][center[1]] === 0) {
        return center;
    }
    // Prefer corners
    let corners = [
        [0, 0], [0, cols - 1],
        [rows - 1, 0], [rows - 1, cols - 1]
    ];
    for (let corner of corners) {
        if (gameState[corner[0]][corner[1]] === 0) {
            return corner;
        }
    }
    // Pick any available move
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameState[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
};

const makeMove = (i, j) => {
    if (gameState[i][j] !== 0 || !gameActive) return;

    gameState[i][j] = (currentPlayer === 'X') ? 1 : 2;
    let cell = document.getElementById(`${i}_${j}`);
    cell.innerHTML = currentPlayer;
    counter++;
    countField.innerHTML = `${counter}`;
    cell.style.background = (currentPlayer === 'X') ? '#efa7ac' : '#efd0a7';
    
    if(isSound)
    {    
        if(currentPlayer === 'X')
            sndP1Move.play();
        else
            sndP2Move.play();
    }    
    isMovesLeft();
    isWinning(i, j);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    handlePlayerSwitch();

    if (isAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 500); // AI takes a turn after a short delay
    }
};

// Modify handleClick to trigger AI move after player's turn
let handleClick = (event) => {
    let clickedIndex = event.target.getAttribute('id').split('_');
    let i = +clickedIndex[0];
    let j = +clickedIndex[1];

    if (gameState[i][j] !== 0 || !gameActive) return;


    makeMove(i, j);
};
