const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");


const app = express();
const server = http.createServer(app);




// Enable CORS for your Firebase frontend
app.use(cors({ origin: "https://tic-tac-e453e.web.app" }));


const io = socketIO(server); // use this for local hosting

/*
use below when want to use server hosting on render
const io = socketIO(server, {
    cors: {
        origin: "https://tic-tac-e453e.web.app",
        methods: ["GET", "POST"],
    },
});*/


// server.listen(3000, () => console.log("Server running on http://localhost:3000"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Store active games
let games = {};
let waitingPlayer = null;

// **Check if a player has won**
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Returns "X" or "O"
        }
    }

    return board.includes(null) ? null : "draw"; // "draw" if no empty cells
}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    if (waitingPlayer === null) {
        // No waiting player, store this player for next match
        waitingPlayer = socket.id;
        socket.emit("waitingForPlayer");
    } else {
        // Create a new game room for this pair
        let room = `game-${waitingPlayer}-${socket.id}`;
        games[room] = {
            board: Array(9).fill(null),
            players: { X: waitingPlayer, O: socket.id },
            turn: "X"
        };

        // Join both players to the game room
        io.to(waitingPlayer).emit("playerType", { type: "X", room });
        io.to(socket.id).emit("playerType", { type: "O", room });

        socket.join(room);
        io.sockets.sockets.get(waitingPlayer).join(room);
        io.to(room).emit("startGame");

        console.log(`Game started in room: ${room}`);

        // Reset waiting player
        waitingPlayer = null;
    }

    socket.on("makeMove", ({ index, room }) => {
        let game = games[room];
        if (!game || game.board[index] !== null) return;

        let playerType = game.players.X === socket.id ? "X" : "O";
        if (game.turn !== playerType) return;

        game.board[index] = playerType;
        io.to(room).emit("updateBoard", { index, player: playerType });

        let winner = checkWinner(game.board);
        if (winner) {
            io.to(room).emit("gameOver", winner);
            delete games[room]; // Remove game after it's over
            return;
        }

        game.turn = game.turn === "X" ? "O" : "X";
        io.to(room).emit("turn", game.turn);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        let roomToDelete = null;
        for (let room in games) {
            if (games[room].players.X === socket.id || games[room].players.O === socket.id) {
                io.to(room).emit("playerLeft");
                roomToDelete = room;
                break;
            }
        }

        if (roomToDelete) delete games[roomToDelete];
        if (waitingPlayer === socket.id) waitingPlayer = null;
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});