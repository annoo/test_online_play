const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};
const colors = ['red', 'orange', 'yellow', 'blue', 'bluegreen', 'purple'];

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    const playerColor = colors[Object.keys(players).length % colors.length]

    players[socket.id] = {
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 600),
        color: playerColor
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });

    socket.on('playerMovement', (movementData) => {
        players[socket.id].x += movementData.x;
        players[socket.id].y += movementData.y;
        io.emit('playerMoved', { id: socket.id, x: players[socket.id].x, y: players[socket.id].y });
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});