const functions = require("firebase-functions");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Store active games
let games = {};
let waitingPlayer = null;

// Check for winners
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes(null) ? null : "draw";
}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    if (!waitingPlayer) {
        waitingPlayer = socket.id;
        socket.emit("waitingForPlayer");
    } else {
        let room = `game-${waitingPlayer}-${socket.id}`;
        games[room] = { board: Array(9).fill(null), players: { X: waitingPlayer, O: socket.id }, turn: "X" };

        io.to(waitingPlayer).emit("playerType", { type: "X", room });
        io.to(socket.id).emit("playerType", { type: "O", room });

        socket.join(room);
        io.sockets.sockets.get(waitingPlayer).join(room);
        io.to(room).emit("startGame");

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
            delete games[room];
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

// Export as a Firebase Cloud Function
exports.app = functions.https.onRequest(app);
