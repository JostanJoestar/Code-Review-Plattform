const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Ein Benutzer ist verbunden");

  // Chat Nachricht empfangen und an alle senden
  socket.on("chatMessage", (data) => {
    io.emit("chatMessage", data);
  });

  // Code aktualisieren
  socket.on("codeUpdate", (code) => {
    socket.broadcast.emit("codeUpdate", code);
  });

  // Chat löschen empfangen
  socket.on("clearChat", () => {
    io.emit("clearChat"); // an alle Clients senden
  });

  socket.on("disconnect", () => {
    console.log("Ein Benutzer hat die Verbindung getrennt");
  });
});

server.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});