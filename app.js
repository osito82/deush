//const { shuffleDeck, cards, dealCards } = require("./deck");
const express = require("express");
const R = require('radash');

const http = require("http");
const WebSocket = require("ws");
const { generateUniqueId } = require("./utils");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const Player = require("./player");
const Dealer = require("./dealer");
const Deck = require("./deck");
const e = require("express");
class Match {
  //NUMBER_PLAYERS = 2;

  log(thisPlayer) {
    console.log("******** LOG ***************");
    console.log("MyId:", thisPlayer.id);
    console.log("players", JSON.stringify(match.players));
    console.log("pot", match.pot);
    console.log("******** *** ***************");
  }

  signUpPlayer(data, id) {
    console.log("signUpPlayer");
    const player = new Player(data.name, data.totalChips, [], id);

    const foundPlayer = match.players.find((myPlayer) => myPlayer.id == id);

    if (!foundPlayer) match.players.push(player);
  }

  initialBet(player, chipsToBet) {
    console.log("initialBet");
    //if (match.players == []) {
      if (R.isEmpty(match.players)) {
      console.log("There are no players");
      console.log("Run signUp");
      return;
    }

    //console.log(player);

    //const player = this.players[0];\
    //const index = this.players.indexOf(player);
    console.log(player.id, match.players);
    const foundPlayer = match.players.find(
      (myPlayer) => myPlayer.id == player.id
    );

    /*  let foundPlayer = match.players.find((myPlayer) => {
      console.log(myPlayer.id, "playes in list");
      console.log(player.id, "player.id - yo");
        myPlayer.id == player.id;
    }); */

    //console.log(foundPlayer, "xxx");
    //if (index !== -1) {
    // El jugador se encontró en el array
    //const player = this.players[index];

    // Realiza operaciones con el jugador, por ejemplo:
    //     const chipsToBet = 10;
    const betResult = foundPlayer.setBet(chipsToBet);
    this.pot = this.pot + chipsToBet;
    console.log(betResult);
    console.log(foundPlayer);
    // }
  }

  startGame() {
    console.log("startGame");
    dealer.dealCardsEachPlayer(2);
    dealer.dealCardsDealer(3);
  }

  players = [];
  pot = 0;
  MATCH_NUMBER = 554854;
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
    //console.log(jsonData)
    if (jsonData && jsonData.action === "signUp") {
      match.signUpPlayer(jsonData, thisPlayer.id);

      console.log(match.players);
    }

    if (jsonData && jsonData.action === "signUp2") {
      match.signUpPlayer(jsonData, generateUniqueId()); //dos jugadores
      //console.log(match.players);
    }

    if (jsonData && jsonData.action === "initialBet") {
      //try {

      const chipsToBet = jsonData.chipsToBet;
      // console.log(chipsToBet, 'chipps to bea5')
      match.initialBet(thisPlayer, chipsToBet);
      // console.log(match.players);
      // } catch (error) {
      //     console.log('error, ' ,error)
      // }
    }

    if (jsonData && jsonData.action === "startGame") {
      match.startGame();
      console.log(match.players);
    }

    if (jsonData && jsonData.action === "log") {
      match.log(thisPlayer);
      // console.log(match.players);
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

// let game = {
//   gameNumber: match.MATCH_NUMBER,
//   //originalDeck: match.originalDeck,
//   players: match.players,
// };

//123queso

app.get("/", (req, res) => res.send("hola mundo"));
server.listen(3333, () => {
  console.log("Servidor escuchando en http://localhost:3333");
});
