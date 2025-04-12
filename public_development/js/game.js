
var game = new Phaser.Game(300, 450, Phaser.AUTO, "", { preload: preload, create: create });

var socket = io(); // use this for local
// use below when want to use server hosting on render
// var socket = io("https://tic-tac222.onrender.com", { secure: true });
var playerType = null;
var board = Array(16).fill(null);
var buttons = [];
var winnerText;
var gameRoom = null;

function preload() {}

function create() {
    game.stage.backgroundColor = "#f4f4f4";

    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(2, 0x000000, 0.1);
    /*graphics.moveTo(100, 0);
    graphics.lineTo(100, 300);
    graphics.moveTo(200, 0);
    graphics.lineTo(200, 300);
    graphics.moveTo(0, 100);
    graphics.lineTo(300, 100);
    graphics.moveTo(0, 200);
    graphics.lineTo(300, 200);*/

    graphics.moveTo(75, 0);
    graphics.lineTo(75, 300);

    graphics.moveTo(150, 0);
    graphics.lineTo(150, 300);

    graphics.moveTo(225, 0);
    graphics.lineTo(225, 300);

    graphics.moveTo(0, 75);
    graphics.lineTo(300, 75);

    graphics.moveTo(0, 150);
    graphics.lineTo(300, 150);

    graphics.moveTo(0, 225);
    graphics.lineTo(300, 225);    


    winnerText = game.add.text(150, 350, "", { font: "20px Arial", fill: "#000000" });
    winnerText.anchor.set(0.5);

    for (let i = 0; i < 16; i++) {
        let x = (i % 4) * 75;
        let y = Math.floor(i / 4) * 75;

        let btn = game.add.button(x, y, null, () => makeMove(i), this);
        btn.width = 75;
        btn.height = 75;

        let text = game.add.text(x + 37.5, y + 37.5, "", { font: "40px Arial", fill: "#0f0" });
        text.anchor.set(0.5);

        buttons.push({ btn, text });
    }


    socket.on("playerType", (data) => {
        console.log(`in client playerType : `,data);
        playerType = data.type;
        gameRoom = data.room;
        // alert("You are player: " + data.type);
        winnerText.text = "You are player: " + data.type;
    });

    socket.on("waitingForPlayer", () => {
        // alert("Waiting for an opponent...");

        winnerText.text = "Waiting for an opponent";
    });

    socket.on("startGame", () => {
        // alert("Game started!");
        winnerText.text = "Game started";
        setTimeout( ()=> {
            winnerText.text = "You are player: " + playerType;    
        },3000);
        
    });

    socket.on("updateBoard", (data) => {
        if(data.player === 'X')
            buttons[data.index].text.fill = "#22ff66";
        else
            buttons[data.index].text.fill = "#eeaa11";
        buttons[data.index].text.text = data.player;
        board[data.index] = data.player;
    });

    socket.on("turn", (turn) => {
        console.log("Turn:", turn);
    });

    socket.on("gameOver", (winner) => {
        winnerText.text = winner === "draw" ? "Game Draw!" : "Player " + winner + " Wins!";
        game.time.events.add(Phaser.Timer.SECOND * 2, resetBoard, this);

    });

    socket.on("playerLeft", () => {
        // alert("Your opponent left. The game is over.");
        winnerText.text = ("Game Over! player left");
        setTimeout( ()=> {
            resetBoard();
        },3000);
        
    });
}

function makeMove(index) {
    console.log(`in make move client index = ${index}`,board[index],gameRoom);
    if (board[index] === null && gameRoom) {
        socket.emit("makeMove", { index, room: gameRoom });
    }
}

function resetBoard() {
    board.fill(null);
    buttons.forEach((b) => (b.text.text = ""));
    winnerText.text = "";
    // location.reload();
}

