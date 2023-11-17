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

//const match = new Match(0);
//const log = new Log();

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
    //console.log(jsonData)
    if (jsonData && jsonData.action === "signUp") {
      log.add({step: "1. Sign Up"})
      match.signUpPlayer(jsonData, thisPlayer.id);

    //  console.log(match.players);
    }

    if (jsonData && jsonData.action === "dealtPrivateCards") {
     match.dealtPrivateCards();
log.add({step: "2. Dealt Private Cards"})
    //  console.log(match.players);
    }

    if (jsonData && jsonData.action === "signUp2") {
      match.signUpPlayer(jsonData, generateUniqueId()); //dos jugadores
      //console.log(match.players);
    }

    if (jsonData && jsonData.action === "initialBet") {
      log.add({step: "3. Initial Bet"})
      const chipsToBet = jsonData.chipsToBet;
      match.initialBet(thisPlayer, chipsToBet);
      // console.log(match.players);
      // } catch (error) {
      //     console.log('error, ' ,error)
      // }
    }

    if (jsonData && jsonData.action === "startGame") {
      match.startGame();
      //console.log(match.players);
      log.add({ players: match.players });
       
    }

    if (jsonData && jsonData.action === "log") {
      log.print();
      ws.send(log.get())
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

//Mehotds Handling

//dealer.dealCards();
//dealer.showCards();
//playerO.showCards();
//player.showCards();

//dealer.showCards();
//dealer.dealCardsEachPlayer(2)
//console.log(match.deck, "xxx");

// let game = {
//   gameNumber: match.MATCH_NUMBER,
//   //originalDeck: match.originalDeck,
//   players: match.players,
// };

app.get("/", (req, res) => res.send("hola mundo"));
server.listen(3333, () => {
  console.log("Servidor escuchando en http://localhost:3333");
});


//module.export = log