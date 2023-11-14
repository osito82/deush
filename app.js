//const { shuffleDeck, cards, dealCards } = require("./deck");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { generateUniqueId } = require("./utils");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const Player = require("./player");
const Dealer = require("./dealer");
const Deck = require("./deck");
class Match {
  MATCH_NUMBER = 554854;
  NUMBER_PLAYERS = 2;

  signUpPlayer(data) {
    console.log("signUpPlayer");
    const player = new Player(
      data.name,
      data.totalChips,
      [],
      generateUniqueId()
    );

    match.players.push(player);
  }

  startGame() {
    console.log('startGame')
    dealer.dealCardsEachPlayer(2)
    dealer.dealCardsDealer(3);
  }

  players = [];
}

const match = new Match();

const shuffledDeck = Deck.shuffleDeck(Deck.cards, 101);
wss.on("connection", (ws) => {
  // Crear un nuevo jugador y asociarlo con la conexión WebSocket
  const thisPlayer = { id: generateUniqueId(), socket: ws };

  // Manejar mensajes del cliente
  ws.on("message", (data) => {
    //console.log(message)
    let jsonData;
    if (data) {
      jsonData = JSON.parse(data);
    }

    if (jsonData && jsonData.action === "signUp") {
      match.signUpPlayer(jsonData);
      console.log(match.players);
    }

    if (jsonData && jsonData.action === "startGame") {
      match.startGame()
      console.log(match.players);
    }


  });

  // Manejar cierre de conexión
  ws.on("close", () => {
    console.log(`Conexión cerrada para el jugador ${thisPlayer.id}`);
    // Remove user when disconects
    const index = match.players.indexOf(thisPlayer);
    if (index !== -1) {
      match.players.splice(index, 1);
    }
  });
});

//Mehotds Handling
const dealer = new Dealer(100, match.players, shuffledDeck);

dealer.dealCards();
dealer.showCards();
//playerO.showCards();
//player.showCards();

//dealer.showCards();
//dealer.dealCardsEachPlayer(2)
//console.log(match.deck, "xxx");

let game = {
  gameNumber: match.MATCH_NUMBER,
  //originalDeck: match.originalDeck,
  players: match.players,
};

//123queso

app.get("/", (req, res) => res.send("hola mundo"));
server.listen(3333, () => {
  console.log("Servidor escuchando en http://localhost:3333");
});
