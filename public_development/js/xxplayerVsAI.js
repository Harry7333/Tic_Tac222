var MyScriptP2AI = (function () {


const statusDisplayAI = document.getElementById('status');
const countFieldAI = document.getElementById('numberTurns');
const startBoxAI = document.getElementById('startBox');
const playFieldAI = document.getElementById('field');
const player1_nameAI = document.getElementById('player1_name');
const player2_nameAI = document.getElementById('player2_name');
const player1AI = document.getElementById('player1');
const player2AI = document.getElementById('player2');

let gameActiveAI = true;
let currentPlayerAI = 'X';
let gameStateAI = [];
let colsAI, rowsAI, stepsAI, counterAI = 0;

const winnMessageAI = () => `${currentPlayerAI} Wins!`;
const nobodyWinsMessageAI = () => `!!Draw!!`;

// ----------------------------------  START GAME
let checkInputAI = (input) => 
{
    input = +input;
    input = (input < 3)
        ? 3
        : (input > 10)
            ? 10
            : input;


    return input;
}
let createMatrixAI = () => {
    let arr;
    for (let i = 0; i < rowsAI; i++) {
        arr = [];
        for (let j = 0; j < colsAI; j++) {
            arr[j] = 0;
        }
        gameStateAI[i] = arr;
    }
    console.log(gameStateAI);
}
let drawFieldAI = () => {
    // let cellSize = window.innerHeight * 0.5 / cols;
    let cellSize = Math.min(window.innerWidth / colsAI, (window.innerHeight * 0.8) / rowsAI);
    console.log(`cellSize ${cellSize}`);
    if(cellSize > 60)
        cellSize = 60;
    console.log(`cellSize ${cellSize}`);
    let box = document.createElement('div');
    box.setAttribute('id', 'container');

    let cell, row
    for (let i = 0; i < rowsAI; i++) {
        row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < colsAI; j++) {
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
    playFieldAI.appendChild(box);
}

let handleStartAI = () => {

    document.getElementById('game-play-bottom').style.display = "block";
    player1AI.innerHTML = player1_nameAI.value === '' ? 'Player \'X\'' : player1_nameAI.value;
    player2AI.innerHTML = player2_nameAI.value === '' ? 'Player \'O\'' : player2_nameAI.value;
    colsAI = checkInputAI(document.getElementById('columns').value);
    rowsAI = checkInputAI(document.getElementById('rows').value);
    console.log(`rows = ${rowsAI}`);
    stepsAI = checkInputAI(document.getElementById('steps').value);
    createMatrixAI();
    drawFieldAI();
    startBoxAI.className = 'hidden';
    handlePlayerSwitchAI();
    document.querySelectorAll('.cell')
        .forEach(cell => cell.addEventListener('click', handleClickAI));
}

// ---------------------------------- WINNER ALGORITHM

let isWinningAI = (y, x) => {
    let winner = currentPlayerAI === 'X' ? 1 : 2,
        length = stepsAI * 2 - 1,
        radius = stepsAI - 1,
        countWinnMoves, winnCoordinates;

    // horizontal
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y, j = x - radius, k = 0; k < length; k++, j++) {
        if (i >= 0 && i < rowsAI && j >= 0 && j < colsAI &&
            gameStateAI[i][j] === winner && gameActiveAI) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === stepsAI) {
                winnActionsAI(winnCoordinates);
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
        if (i >= 0 && i < rowsAI && j >= 0 && j < colsAI &&
            gameStateAI[i][j] === winner && gameActiveAI) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === stepsAI) {
                winnActionsAI(winnCoordinates);
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
        if (i >= 0 && i < rowsAI && j >= 0 && j < colsAI &&
            gameStateAI[i][j] === winner && gameActiveAI) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === stepsAI) {
                winnActionsAI(winnCoordinates);
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
        if (i >= 0 && i < rowsAI && j >= 0 && j < colsAI &&
            gameStateAI[i][j] === winner && gameActiveAI) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === stepsAI) {
                winnActionsAI(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }
}

// ----------------------------------  GAME ONGOING

let handlePlayerSwitchAI = () => {
    if (currentPlayerAI === 'X') {
        player1AI.style.background = '#e0d9a9';
        player2AI.style.background = '#8f8f8f';
        player1AI.innerHTML = (player1_nameAI.value != '') ? player1_nameAI.value+" turn" : "AIPlayer 'X' Turn";
        player2AI.innerHTML = (player2_nameAI.value != '') ? player2_nameAI.value : "Player 'O'";
    } else {
        player1AI.style.background = '#8f8f8f';
        player2AI.style.background = '#e0d9a9';
        player2AI.innerHTML = (player2_nameAI.value != '') ? player2_nameAI.value+" turn" : "AIPlayer 'O' Turn";
        player1AI.innerHTML = (player1_nameAI.value != '') ? player1_nameAI.value : "Player 'X'";
    }
}

let isMovesLeftAI = () => {
    if (counterAI === colsAI * rowsAI) 
    {
        statusDisplayAI.innerHTML = nobodyWinsMessageAI();
        //gameActive = false;
    }
}

let handleClickAI = (event) => {
    let clickedIndex = event.target.getAttribute('id').split('_');
    let i = +clickedIndex[0];
    let j = +clickedIndex[1];

    if (gameStateAI[i][j] !== 0 || !gameActiveAI)
        return;

    gameStateAI[i][j] = (currentPlayerAI === 'X') ? 1 : 2;
    event.target.innerHTML = currentPlayerAI;
    countFieldAI.innerHTML = `${++counterAI}`;

    if(currentPlayerAI === 'X')
        event.target.style.background = '#efa7ac';
    else
        event.target.style.background = '#efd0a7';

    isMovesLeftAI();
    isWinningAI(i, j);
    currentPlayerAI = currentPlayerAI === 'X' ? 'O' : 'X';
    handlePlayerSwitchAI();

    // console.log(gameState)
}

// ----------------------------------  SHOW WINNING RESULTS

function winnActionsAI(winner) {
    console.log(winner);

    gameActiveAI = false;
    statusDisplayAI.innerHTML = winnMessageAI();
    statusDisplayAI.style.color = '#139de2';

    let cell;
    for (let i = 0; i < winner.length; i++) {
        cell = document.getElementById(`${winner[i][0]}_${winner[i][1]}`);
        cell.style.color = '#139de2';
    }
}

// ----------------------------------  RESET GAME
let handlePlayAgainAI = () => {
    gameActiveAI = true;
    currentPlayerAI = 'X';
    counterAI = 0;
    countFieldAI.innerHTML = '0';
    statusDisplayAI.innerHTML = '';
    statusDisplayAI.style.color = 'black';
    player1AI.style.background = player2AI.style.background = '#8f8f8f';
    playFieldAI.removeChild(document.getElementById('container'));
    handleStartAI();
}

let handleRestartAI = () => {
    document.getElementById('game-play-bottom').style.display = "none";
    gameActiveAI = true;
    currentPlayerAI = 'X';
    counterAI = 0;
    countFieldAI.innerHTML = '0';
    statusDisplayAI.innerHTML = '';
    statusDisplayAI.style.color = 'black';
    player1AI.style.background = player2AI.style.background = '#8f8f8f';
    player1_nameAI.value = player2_nameAI.value = '';
    player1AI.innerHTML = player2AI.innerHTML = '-';
    startBoxAI.className = 'sidebar1';
    playFieldAI.removeChild(document.getElementById('container'));
}


let handleBackAI = () => {
    document.getElementById('main').style.display = "none";
}


document.querySelector('#start').addEventListener('click', handleStartAI);
document.querySelector('#playAgain').addEventListener('click', handlePlayAgainAI);
document.querySelector('#restart').addEventListener('click', handleRestartAI);
document.querySelector('#back').addEventListener('click', handleBackAI);
})();