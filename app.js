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

wss.on("connection", (ws) => {
  // Crear un nuevo jugador y asociarlo con la conexión WebSocket
  const thisPlayer = { id: generateUniqueId(), socket: ws };
  log.add({ thisPlayer: thisPlayer.id });
  // Manejar mensajes del cliente
  ws.on("message", (data) => {
    //console.log(message)
    let jsonData;

    if (data) {
      jsonData = JSON.parse(data);
    }

    if (jsonData && jsonData.action === "signUp") {
      log.add({ step: "1. Sign Up" });
      match.signUpPlayer(jsonData, thisPlayer.id);
    }

    if (jsonData && jsonData.action === "initialBet") {
      log.add({ step: "2. Initial Bet" });
      const chipsToBet = jsonData.chipsToBet;
      match.initialBet(thisPlayer, chipsToBet);
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
    console.log(`Conexión cerrada para el jugador ${thisPlayer.id}`);
    log.print();
    // Remove user when disconects
    const index = match.players.indexOf(thisPlayer);
    if (index !== -1) {
      match.players.splice(index, 1);
    }
  });
});

app.get("/", (req, res) => res.send("hola mundo"));
server.listen(3333, () => {
  console.log("Servidor escuchando en http://localhost:3333");
});

//module.export = log
