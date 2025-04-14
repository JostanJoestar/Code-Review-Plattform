const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Statischer Ordner für HTML, CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket-Logik
io.on('connection', (socket) => {
    console.log('Ein Nutzer verbunden: ' + socket.id);

    // Code-Editor: Code wird aktualisiert
    socket.on('codeUpdate', (code) => {
        socket.broadcast.emit('codeUpdate', code); // an andere Clients senden
    });

    // Chat: Neue Nachricht
    socket.on('chatMessage', (data) => {
      io.emit('chatMessage', data);
  });

    // Chat leeren
    socket.on('clearChat', () => {
        socket.broadcast.emit('clearChat');
    });

    socket.on('disconnect', () => {
        console.log('Ein Nutzer hat die Verbindung getrennt: ' + socket.id);
    });
});

// Server starten
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server läuft unter http://localhost:${PORT}`);
});
