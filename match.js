const Player = require("./player");
const Dealer = require("./dealer");
const Deck = require("./deck");

const R = require("radash");
const log = require("./log");


class Match {
  //NUMBER_PLAYERS = 2;

  constructor() {
    //  this.players = players;
   // this.pot = pot;
    //this.totalChips = totalChips;
    //this.cards = cards;
    // console.log("PLAYER", name, "cards:", cards);
  }
pot = 0
  players = [];
  // pot = 0;
  shuffledDeck = Deck.shuffleDeck(Deck.cards, 101);
  dealer = new Dealer(100, this.players, this.shuffledDeck);



  signUpPlayer(data, id) {
    console.log("signUpPlayer");
    const player = new Player(data.name, data.totalChips, [], id);

    const foundPlayer = this.players.find((myPlayer) => myPlayer.id == id);

    if (!foundPlayer) this.players.push(player);
  }

  initialBet(player, chipsToBet) {
    console.log("initialBet");
    //if (match.players == []) {
    if (R.isEmpty(this.players)) {
      console.log("There are no players");
      console.log("Run signUp");
      return;
    }

    //console.log(player);

    //const player = this.players[0];\
    //const index = this.players.indexOf(player);
    console.log(player.id, this.players);
    const foundPlayer = this.players.find(
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
  //  console.log(betResult);
  //  console.log(foundPlayer);
    // }
  }

  startGame() {
    console.log("startGame");
    this.dealer.dealCardsEachPlayer(2);
    this.dealer.dealCardsDealer(3);
    //console.log(this.dealer.showCards())
    log.add({'dealerCards':this.dealer.showCards()})
    
  }
}

module.exports = new Match();
