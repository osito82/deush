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
  const thisPlayer = { id: generateUniqueId(), socket: ws };

  log.add({ thisPlayer: thisPlayer.id });

  ws.on("message", (data) => {
    //console.log(message)
    let jsonData;

    if (data) {
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        console.error("Error al analizar el JSON:", error);
        // Puedes enviar un mensaje de error al cliente si es necesario
        ws.send(JSON.stringify({ error: "Formato JSON no válido" }));
        return;
      }
    }

    if (jsonData && jsonData.action === "sendMessage") {
      const targetPlayerId = jsonData.targetPlayerId;
      const targetMessage = jsonData.targetMessage;
      console.log(jsonData);


      // Encuentra el socket del jugador objetivo
      // const targetSocket = findSocketByPlayerId(targetPlayerId);

      const targetPlayer = match.players.find((player) => {
      //  console.log(player , '0021 -1 548')
        return player.id === targetPlayerId;
      });

      // const targetPlayer = match.players.find(
      //   (player) => {player.id === targetPlayerId
      //  console.log(player)
      //   console.log(player.id)
      //    console.log(targetPlayerId)
      //}
      // );
    //  console.log(targetPlayer), "88888";
      // if (targetSocket) {
      if (targetPlayer && targetPlayer.socket) {
        //console.log('xxx')
        // Envía el mensaje al jugador objetivo
        targetPlayer.socket.send(
      //    targetMessage
  //    "123 queso"
           JSON.stringify({ 'message': targetMessage })
        );
      } else {
        console.log(
          `Jugador con ID ${targetPlayerId} no encontrado o sin socket`
        );
        return;
      }
      // }
      // return
    }

    if (jsonData && jsonData.action === "signUp") {
      log.add({ step: "1. Sign Up" });
      match.signUpPlayer(jsonData, thisPlayer.id, thisPlayer.socket);
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
