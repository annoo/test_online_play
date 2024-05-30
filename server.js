const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};
const colors = ['red', 'orange', 'yellow', 'blue', 'bluegreen', 'purple'];
const spawnPoints = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
    { x: 400, y: 100 },
    { x: 500, y: 100 },
    { x: 600, y: 100 },
]

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    const playerIndex = Object.keys(player).length %colors.length;
    const playerColor = colors[playerIndex];
    const spawnPoint = spawnPoints[playerIndex];

    players[socket.id] = {
        x: spawnPoint.x,
        y: spawnPoint.y,
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