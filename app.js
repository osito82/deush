const express = require("express");
const R = require("radash");

const http = require("http");
const WebSocket = require("ws");

const { generateUniqueId } = require("./utils");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const log = require("./log");
const match = require("./match");
const Socket = require("./sockets");

wss.on("connection", (ws) => {
  const thisSocket = { id: generateUniqueId(), socket: ws };
  Socket.addSocket(thisSocket);

  ws.on("message", (data) => {
    let jsonData;

    if (data) {
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        console.error("Error al analizar el JSON:", error);
        ws.send(JSON.stringify({ error: "Formato JSON no válido" }));
        return;
      }
    }

    if (jsonData && jsonData.action === "sendMessage") {
      const targetPlayerId = jsonData.targetPlayerId;
      const targetMessage = jsonData.targetMessage;

      const targetSocket = Socket.getSocket(targetPlayerId);

      if (targetSocket && targetSocket.socket) {
        targetSocket.socket.send(JSON.stringify({ message: targetMessage }));
      } else {
        console.log(
          `Jugador con ID ${targetPlayerId} no encontrado o sin socket`
        );
      }
    }

    if (jsonData && jsonData.action === "signUp") {
      log.add({ step: "1. Sign Up" });
      match.signUpPlayer(jsonData, thisSocket.id);
    }

    if (jsonData && jsonData.action === "initialBet") {
      log.add({ step: "Initial Bet" });
      const chipsToBet = jsonData.chipsToBet;
      
      match.initialBet(thisSocket.id, chipsToBet);
    }

    if (jsonData && jsonData.action === "dealtPrivateCards") {
      match.dealtPrivateCards();
      log.add({ step: "3. Dealt Private Cards" });
    }

    if (jsonData && jsonData.action === "startGame") {
      match.startGame();
      log.add({ step: "4. Start the Game" });
      log.add({ players: match.players });
    }

    if (jsonData && jsonData.action === "log") {
      log.print();
      ws.send(log.get());
    }
  });

  // Manejar cierre de conexión
  ws.on("close", () => {
    console.log(`Conexión cerrada para el jugador ${thisSocket.id}`);

    // Remove user when disconects
    const index = match.players.indexOf(thisSocket);
    if (index !== -1) {
      match.players.splice(index, 1);
    }
  });
});

app.get("/", (req, res) => res.send("hola mundo"));
server.listen(3333, () => {
  console.log("Servidor escuchando en http://localhost:3333");
});
