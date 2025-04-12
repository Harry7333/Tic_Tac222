const statusDisplay = document.getElementById('status');
const countField = document.getElementById('numberTurns');
const startBox = document.getElementById('startBox');
const playField = document.getElementById('field');
const player1_name = document.getElementById('player1_name');
const player2_name = document.getElementById('player2_name');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const countdownPElement = document.getElementById('countdown');
const player1Timer = document.getElementById('player1Timer');
const player2Timer = document.getElementById('player2Timer');

var socket;// = io(); 

let gameActive = true;
let currentPlayer = 'X';
let gameState = [];
let cols, rows, steps, counter = 0;
let socketIdOfX = '';

const winnMessageMulti = () => `You Won!`;
const winnMessage = () => `${currentPlayer} Wins!`;
const loseMessage = () => `You Lost!`;

const nobodyWinsMessage = () => `!!Draw!!`;

let blinkInterval;

let checkInput = (input) => {
    input = +input;
    return Math.max(3, Math.min(10, input));
};

let createMatrix = () => {
    gameState = Array.from({ length: rows }, () => Array(cols).fill(0));
};

function calculateCellSize(numOfRows){
    switch(numOfRows)
    {
        case 3: return 80; break;
        case 4: return 65; break;
        case 5: return 55; break;
        case 6: return 40; break;
        case 7: return 35; break;
        case 8: return 30; break;
        case 9: return 30; break;
        case 10: return 30; break;
    }
}
let drawField = () => {
    let cellSize = Math.min(window.innerWidth / cols, (window.innerHeight * 0.4) / rows);
    /*cellSize = calculateCellSize(rows);
    window.alert(`cellSize = ${cellSize}`);
    cellSize = Math.min(cellSize, 60);*/
    if(isDesktop)
        cellSize = Math.min(320 / cols, (320) / rows);
    // window.alert(`isDesktop = ${isDesktop}, cellSize = ${cellSize}`);
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

    console.log(`countDown = ${countDown}`);
    
    if(!isStepValueValid || !isColValueValid || !isRowValueValid)
        return;
    if(countDown == 3)
    {
        cols = checkInput(document.getElementById('columns').value);
        rows = checkInput(document.getElementById('rows').value);
        steps = checkInput(document.getElementById('steps').value);

        if(gameMode === 'multiplayer')
        {
            cols = 4;
            rows = 4;
            steps = 4;
        }
        else
            show321();    
        
        id=RandomInt(0, 2);//(min, max)
        bgPath = `./assets/bg${id}.png`;
        document.getElementById("main").style.backgroundImage = `url(${bgPath})`;
        
        document.getElementById('game-play-bottom').style.display = "block";
        userName = player1_name.value || userName;
        player1.innerHTML = userName || 'Player X';//player1_name.value || 'Player X';
        player2.innerHTML = player2_name.value || 'Player O';
        if(isAI)
            player2.innerHTML = player2_name.value || 'AI: Player O';
        document.getElementById("user-name").value = userName;

        
        // isAI = true;
        createMatrix();
        drawField();
        startBox.className = 'hidden';

        userPoints-=p2pPoints;
        document.getElementById("config-point").innerHTML = `Available Points: ${userPoints}`;
        setSoundIcon();
        soundonoff.style.display = "block";
        countField.style.display = "block";
    }
    else
    {    
        handlePlayerSwitch();
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleClick));
    }    
};

let handlePlayerSwitch = () => {

    player1.style.background = currentPlayer === 'X' ? '#e0d9a9' : '#8f8f8f';
    player2.style.background = currentPlayer === 'O' ? '#e0d9a9' : '#8f8f8f';
    
    if (isAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 500); // AI makes a move with delay
    }
    if(gameActive)
    {
        if(currentPlayer === 'X')
        {
            blinkPlayer(player1);
            startTimer(player1Timer,1);
        }    
        else
        {
            blinkPlayer(player2);
            startTimer(player2Timer,2);
        }
    }  


};

let timerInterval;
const totalTime=10;
let timeCounter = 0;
let player1Life = 2;
let player2Life = 2;
function startTimer(timerElement,player) 
{
    let isHighlighted = false;

    
    // Clear any existing interval to prevent multiple blinks
    clearInterval(timerInterval);
    player1Timer.innerHTML = '-';
    player2Timer.innerHTML = '-';
    timerElement.innerHTML = totalTime;
    timeCounter = totalTime;
    timerInterval = setInterval(() => {
        timerElement.innerHTML = --timeCounter;
        if(timeCounter < 1)
        {
            clearInterval(timerInterval);
            if(player == 1)
                player1Life--;
            else
                player2Life--;

            if(gameMode === 'multiplayer')
            {
                //gameRoom = data.room;gameRoom.players.X === socket.id ? "X" : "O";
                if(socketIdOfX === socket.id)
                {
                    console.log(`emmiting switchPlayer`);
                    socket.emit("switchPlayer", { room: gameRoom });  
                }    
            } 
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            
            console.log(`player1Life = ${player1Life}, player2Life = ${player2Life}`);

            if(player1Life < 1 || player2Life < 1)
            {
                declareWinner('win'); // time up                 
            }    
            else
                handlePlayerSwitch();


        } 
    }, 1000); // Change color every 500ms
};

function blinkPlayer(playerElement) {
    let isHighlighted = false;

    // Clear any existing interval to prevent multiple blinks
    clearInterval(blinkInterval);
    if(gameActive)
        blinkInterval = setInterval(() => {
            playerElement.style.background = isHighlighted ? '#e0d9a9' : '#8f8f8f';
            isHighlighted = !isHighlighted;
        }, 500); // Change color every 500ms
};

let blinkInterval2;
let n=0;
function blinkStatus(blinkElement) {
    let isHighlighted = false;

    // Clear any existing interval to prevent multiple blinks
    clearInterval(blinkInterval2);
    blinkInterval2 = setInterval(() => {
           // blinkElement.style.background = isHighlighted ? '#e0d9a9' : '#8f8f8f';
            if(n < 10)
                n='0'+n;
            ani_url = `./assets/star-ani/Stars_000${n}.png`;
            blinkElement.style.backgroundImage = `url(${ani_url})`;
            isHighlighted = !isHighlighted;
            if(n < 15) n++;
            else n = 0;    
    }, 50); 
};

let interval321;
let countDown = 3;
function show321() {

    countdownPElement.style.top = '140px';
    countdownPElement.style.fontSize = "5em";
      
    countdownPElement.style.display = "block";
    countdownPElement.innerHTML = countDown;
    // console.log(`countDown = ${countDown}`);
    // Clear any existing interval to prevent multiple blinks
    clearInterval(interval321);
    interval321 = setInterval(() => {
        if(countDown > 1)
        {
            countdownPElement.innerHTML = --countDown;
            // console.log(`countDown = ${countDown}`);
        }    
        else
        {
            countDown=0;
            countdownPElement.style.display = "none";
            clearInterval(interval321);
            handleStart();
        }    
    }, 1000); // Change color every 500ms
};

let isMovesLeft = () => {
    if (counter === cols * rows) {
        declareWinner('draw');
        //if(isSound) sndDraw.play();
    }
};

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
            declareWinner('win');
            /*if(isSound)
            {    
                if(currentPlayer === 'X')
                    sndWin.play();
                else
                    sndLose.play();
            }*/    
            return;
        }
    }
    isMovesLeft();
};

let handlePlayAgain = () => {

    resetValues();
    setSoundIcon();
    soundonoff.style.display = "block";
    countField.style.display = "block";
    countField.innerHTML = 'Number of turns: 0';
    handleStart();
    
};

let handleRestart = () => {

    resetValues();
    document.getElementById("main").style.backgroundImage = "url('./assets/commonbg.png')";
    document.getElementById('game-play-bottom').style.display = "none";
    soundonoff.style.display = "none";
    countField.style.display = "none";
    statusDisplay.style.color = '#232d55';
    player1_name.value = userName;
    player2_name.value = '';
    player1.innerHTML = player2.innerHTML = '-';
    startBox.className = 'sidebar1';
}

function resetValues()
{
    console.log(`countDown = ${countDown}`);
    if(countDown>0)
        return;
    clearInterval(timerInterval);
    clearInterval(blinkInterval);
    timeCounter = 0;
    player1Life = 2;
    player2Life = 2;
    player1Timer.innerHTML = '-';
    player2Timer.innerHTML = '-';
    gameActive = true;
    countDown = 3;
    currentPlayer = 'X';
    counter = 0;
    statusDisplay.style.display = "none";
    statusDisplay.innerHTML = '';
    player1.style.background = player2.style.background = '#8f8f8f';
    playField.removeChild(document.getElementById('container'));
}

let handleBack = () => {
    document.getElementById('main').style.display = "none";
    showMenu();
}
let handleHome = () => {

    console.log(`countDown = ${countDown}`);
    
    // if(countDown>0)
    //     return;

    
    handleRestart();
    handleBack();
    showMenu();
    if(gameMode === 'multiplayer')
        disConnectMe();
}
let handleSound = () => {
    isSound = !isSound;
    setSoundIcon();
}
let setSoundIcon = () => {
    if(isSound)
    {
        document.getElementById('btn-sound').innerHTML = "Sound On";
        document.getElementById('soundonoff').style.backgroundImage = "url('./assets/soundon.png')";
    }    
    else
    {
        document.getElementById('btn-sound').innerHTML = "Sound Off";
        document.getElementById('soundonoff').style.backgroundImage = "url('./assets/soundoff.png')";
    }    
}




document.querySelector('#start').addEventListener('click', handleStart); // start button on config
document.querySelector('#playAgain').addEventListener('click', handlePlayAgain); // play again on gameplay
document.querySelector('#restart').addEventListener('click', handleRestart); // back from gameplay to config
document.querySelector('#back').addEventListener('click', handleBack);// back from config to info
document.querySelector('#home').addEventListener('click', handleHome);// gameplay to menu
document.querySelector('#soundonoff').addEventListener('click', handleSound);// sound on/off on gameplay




let isStepValueValid = true;
let isColValueValid = true;
let isRowValueValid = true;
document.getElementById("steps").addEventListener("focus", function() {
    this.value = "";
    this.style.backgroundColor = "white";
});
document.getElementById("columns").addEventListener("focus", function() {
    this.value = "";
    this.style.backgroundColor = "white";
});
document.getElementById("rows").addEventListener("focus", function() {
    this.value = "";
    this.style.backgroundColor = "white";
});
document.getElementById("columns").addEventListener("blur", function () {
    var value = parseInt(this.value);
    if(value < 3 || value > 10)
    {
        isColValueValid = false;
        this.style.backgroundColor = "red"; // Change to red if input is invalid
        document.getElementById("message-popup").style.display = "flex";
        document.getElementById("message").innerHTML = `Value must be between 3 and 10`;
    }    
    else
        isColValueValid = true;

    setTimeout(()=>{
        if(isColValueValid)
            this.style.backgroundColor = "white"; // Reset to white if valid
        document.getElementById("message-popup").style.display = "none";
        document.getElementById("message").innerHTML = `-`;
    },3000);

});
document.getElementById("rows").addEventListener("blur", function () {
    var value = parseInt(this.value);
    if(value < 3 || value > 10)
    {
        isRowValueValid = false;
        this.style.backgroundColor = "red"; // Change to red if input is invalid
        document.getElementById("message-popup").style.display = "flex";
        document.getElementById("message").innerHTML = `Value must be between 3 and 10`;
    }    
    else
        isRowValueValid = true;

    setTimeout(()=>{
        if(isRowValueValid)
            this.style.backgroundColor = "white"; // Reset to white if valid
        document.getElementById("message-popup").style.display = "none";
        document.getElementById("message").innerHTML = `-`;
    },3000);

});
document.getElementById("steps").addEventListener("input", function () {
    cols = checkInput(document.getElementById('columns').value);
    rows = checkInput(document.getElementById('rows').value);
    steps = parseInt(this.value);

    let lowest = Math.min(rows, cols);

    if (steps > rows || steps > cols || steps < 3) {
        isStepValueValid = false;
        this.style.backgroundColor = "red"; // Change to red if input is invalid
        document.getElementById("message-popup").style.display = "flex";
        if(steps < 3)
            document.getElementById("message").innerHTML = `Value must be atleast 3.`;
        else
            document.getElementById("message").innerHTML = `Value should be less than ${lowest}`;
    } else {
        this.style.backgroundColor = "white"; // Reset to white if valid
        isStepValueValid = true;
    }
    
    setTimeout(()=>{
        if(isStepValueValid)
            this.style.backgroundColor = "white"; // Reset to white if valid
        document.getElementById("message-popup").style.display = "none";
        document.getElementById("message").innerHTML = `-`;
    },3000);
});

/*document.getElementById("main").addEventListener("input", function () {
    document.getElementById("message-popup").style.display = "none";
    
});*/
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
    setSoundIcon();
    soundonoff.style.display = "block";
    countField.style.display = "block";
    countField.innerHTML = `Number of turns: ${counter}`;
    cell.style.background = (currentPlayer === 'X') ? '#efa7ac' : '#efd0a7';
       
    isMovesLeft();
    isWinning(i, j);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    handlePlayerSwitch();

    if (isAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 500); // AI takes a turn after a short delay
    }

   /* if(isSound)
    {    
        if(currentPlayer === 'X') sndP1Move.play();
        else sndP2Move.play();
    } */
};

// Modify handleClick to trigger AI move after player's turn
let handleClick = (event) => {

    let clickedIndex = event.target.getAttribute('id').split('_');
    let i = +clickedIndex[0];
    let j = +clickedIndex[1];

    if (gameState[i][j] !== 0 || !gameActive) return;
    
    if(gameMode === 'multiplayer')
    {
        index = getIndex(i,j);
        console.log(`in handleClick`);
        makeMoveMulti(index);
    }
    else
        makeMove(i, j);
};

function getIndex(i,j){
    return ((4*i)+j);
}
function getI(num) {
    return Math.floor(num/4);
}
function getJ(num) {
    return Math.floor(num%4);
}
function multiplayer()
{
    socket.on("playerType", (data) => {
        console.log(`in client playerType : `,data);
        playerType = data.type;
        if(playerType === 'X')
        {
            socketIdOfX = socket.id;
            player1.innerHTML = 'You Player X';
            player2.innerHTML = 'Oppo Player O';
        }    
        else
        {
            player1.innerHTML = 'Oppo Player X';
            player2.innerHTML = 'You Player O';
        }    

        console.log(`socketIdOfX = ${socketIdOfX}`);
        gameRoom = data.room;
        //alert("You are player: " + data.type);
        countdownPElement.style.display = "block";
        countdownPElement.style.top = '180px';
        countdownPElement.style.fontSize = "2em";
        countdownPElement.innerHTML = "You are player: " + data.type;
        // winnerText.text = "You are player: " + data.type;
    });

    socket.on("waitingForPlayer", () => {
        // alert("Waiting for an opponent...");
        //winnerText.text = "Waiting for an opponent";

        countdownPElement.style.display = "block";
        countdownPElement.style.top = '180px';
        countdownPElement.style.fontSize = "2em";
        countdownPElement.innerHTML = "Waiting for an opponent";
        if(isDesktop)
        {
            countdownPElement.style.fontSize = "2.5em";
        }    

    });

    socket.on("startGame", () => {
        // alert("Game started!");
        // winnerText.text = "Game started";
        setTimeout( ()=> {
            countdownPElement.innerHTML = "Game started";
        },1000);
        setTimeout( ()=> {
            show321();   
        },2000);
        
    });

    socket.on("updateBoard", (data) => {
        // if(data.player === 'X')
        //     buttons[data.index].text.fill = "#22ff66";
        // else
        //     buttons[data.index].text.fill = "#eeaa11";
        // buttons[data.index].text.text = data.player;
        // board[data.index] = data.player;
        i = getI(data.index);
        j = getJ(data.index);
        makeMove(i, j);
    });

    socket.on("turn", (turn) => {
        console.log("Turn:", turn);
    });

    socket.on("gameOver", (winner) => {
        // winnerText.text = winner === "draw" ? "Game Draw!" : "Player " + winner + " Wins!";
        // game.time.events.add(Phaser.Timer.SECOND * 2, resetBoard, this);
        console.log(`SERVER winner is ${winner}`);
        let result = 'draw';
        if(winner === "X" || winner === "O")
        {
            currentPlayer = winner;
            result = 'win';
        }
        declareWinner(result);        

    });

    socket.on("playerLeft", (playerWhoHasLeft) => {
        // alert("Your opponent left. The game is over.");
        // winnerText.text = ("Game Over! player left");
        countdownPElement.style.display = "block";
        countdownPElement.style.fontSize = "2em";
        countdownPElement.innerHTML = "Game Over! player left";
        console.log(`playerWhoHasLeft = ${playerWhoHasLeft}`,playerWhoHasLeft);
        currentPlayer = playerWhoHasLeft === 'X' ? 'O' : 'X'; // here current player means winner
        setTimeout( ()=> {
            countdownPElement.innerHTML = " ";
            resetBoard();
            declareWinner('win');
        },3000);
        
    });
}

function disConnectMe()
{
    console.log(`in disConnectMe = `,socket.id);
    socket.disconnect();
}
function makeMoveMulti(index) {
    console.log(`in make move client index = ${index}`);
    // if (board[index] === null && gameRoom) 
    {
        socket.emit("makeMove", { index, room: gameRoom });
    }
}

function resetBoard() {
    //board.fill(null);
    //buttons.forEach((b) => (b.text.text = ""));
    // winnerText.text = "";
    // location.reload();
}

function declareWinner(result)
{
    gameActive = false;
    clearInterval(blinkInterval);
    clearInterval(timerInterval);
    player1Timer.innerHTML = '-';
    player2Timer.innerHTML = '-';
    statusDisplay.style.display = "flex";

    if(result === 'win')
    {
        blinkStatus(statusDisplay);
        if(gameMode === 'multiplayer')
        {
            if(currentPlayer === 'X') // if winner is X
            {
                if(socketIdOfX === socket.id) // this system is of X
                    statusDisplay.innerHTML = winnMessageMulti();
                else
                    statusDisplay.innerHTML = loseMessage();    
            }    
            else if(currentPlayer === 'O')
            {
                if(socketIdOfX === socket.id)
                    statusDisplay.innerHTML = loseMessage();
                else
                    statusDisplay.innerHTML = winnMessageMulti();    
            }
        }    
        else
            statusDisplay.innerHTML = winnMessage(); // for p2p and p2ai
        
    }
    else  // draw
    {
        statusDisplay.innerHTML = nobodyWinsMessage();
    }    

}