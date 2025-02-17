
var game = new Phaser.Game(300, 350, Phaser.AUTO, "", { preload: preload, create: create });

var socket = io("https://tic-tac222.onrender.com", { secure: true });
var playerType = null;
var board = Array(9).fill(null);
var buttons = [];
var winnerText;
var gameRoom = null;

function preload() {}

function create() {
    game.stage.backgroundColor = "#f4f4f4";

    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(5, 0x000000, 1);
    graphics.moveTo(100, 0);
    graphics.lineTo(100, 300);
    graphics.moveTo(200, 0);
    graphics.lineTo(200, 300);
    graphics.moveTo(0, 100);
    graphics.lineTo(300, 100);
    graphics.moveTo(0, 200);
    graphics.lineTo(300, 200);

    winnerText = game.add.text(150, 320, "", { font: "20px Arial", fill: "#ff0000" });
    winnerText.anchor.set(0.5);

    for (let i = 0; i < 9; i++) {
        let x = (i % 3) * 100;
        let y = Math.floor(i / 3) * 100;

        let btn = game.add.button(x, y, null, () => makeMove(i), this);
        btn.width = 100;
        btn.height = 100;

        let text = game.add.text(x + 50, y + 50, "", { font: "40px Arial", fill: "#000" });
        text.anchor.set(0.5);

        buttons.push({ btn, text });
    }

    socket.on("playerType", (data) => {
        playerType = data.type;
        gameRoom = data.room;
        alert("You are player: " + data.type);
    });

    socket.on("waitingForPlayer", () => {
        alert("Waiting for an opponent...");
    });

    socket.on("startGame", () => {
        alert("Game started!");
    });

    socket.on("updateBoard", (data) => {
        buttons[data.index].text.text = data.player;
        board[data.index] = data.player;
    });

    socket.on("turn", (turn) => {
        console.log("Turn:", turn);
    });

    socket.on("gameOver", (winner) => {
        winnerText.text = winner === "draw" ? "It's a Draw!" : "Player " + winner + " Wins!";
        game.time.events.add(Phaser.Timer.SECOND * 2, resetBoard, this);
    });

    socket.on("playerLeft", () => {
        alert("Your opponent left. The game is over.");
        resetBoard();
    });
}

function makeMove(index) {
    if (board[index] === null && gameRoom) {
        socket.emit("makeMove", { index, room: gameRoom });
    }
}

function resetBoard() {
    board.fill(null);
    buttons.forEach((b) => (b.text.text = ""));
    winnerText.text = "";
}