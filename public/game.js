const socket = io();

let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
let players = {};
let player = {};
const colors = ['red', 'orange', 'yellow', 'blue', 'bluegreen', 'purple'];

socket.on('currentPlayers', (currentPlayers) => {
    players = currentPlayers;
    for (let id in currentPlayers) {
        if (id === socket.id) {
            player = currentPlayers[id];
        }
    }
    drawPlayers();
});

socket.on('newPlayer', (newPlayer) => {
    players[newPlayer.id] = newPlayer;
    drawPlayers();
});

socket.on('playerDisconnected', (id) => {
    delete players[id];
    drawPlayers();
});

socket.on('playerMoved', (playerData) => {
    players[playerData.id].x = playerData.x;
    players[playerData.id].y = playerData.y;
    drawPlayers();
});

document.addEventListener('keydown', (event) => {
    let movementData = { x: 0, y: 0 };
    switch (event.key) {
        case 'ArrowUp':
            movementData.y = -5;
            break;
        case 'ArrowDown':
            movementData.y = 5;
            break;
        case 'ArrowLeft':
            movementData.x = -5;
            break;
        case 'ArrowRight':
            movementData.x = 5;
            break;
    }
    socket.emit('playerMovement', movementData);
});

function drawPlayers() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let i = 0;
    for (let id in players) {
        context.fillStyle = colors[i % colors.length];
        context.beginPath()
        context.arc(players[id].x, players[id].y, 10, 0, Math.PI * 2);
        context.fill();
        i++;
    }
}