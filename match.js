const Player = require("./player");
const Dealer = require("./dealer");
const Deck = require("./deck");

const R = require("radash");
const log = require("./log");
const { generateUniqueId } = require("./utils");

class Match {
  constructor() {
    this.gameId = generateUniqueId();
  }

  pot = 0;
  gameId = 0;
  players = [];

  shuffledDeck = Deck.shuffleDeck(Deck.cards, 101);
  dealer = new Dealer(this.gameId, this.players, this.shuffledDeck);

  signUpPlayer(data, thisPlayerId) {
    console.log("MATCH - signUpPlayer");

    if (this.players.length >= 10) {
      console.log("Max Ten Players"); //todo max players
      return;
    }

    const player = new Player(
      this.gameId,
      data.name,
      data.totalChips,
      [],
      thisPlayerId
    );
    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisPlayerId
    );

    const playerNumber = this.players.length + 1;

    player.setPlayerNumber(playerNumber);

    if (!foundPlayer) this.players.push(player);
  }

  dealtPrivateCards() {
    console.log("MATCH - dealtPrivateCards");
    this.dealer.dealCardsEachPlayer(2);
  }

  
  initialBet(thisPlayer, chipsToBet) {
    console.log("MATCH - initialBet");
    if (R.isEmpty(this.players)) {
      //todo -> send mensaje consola
      return;
    }

    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisPlayer.id
    );

    //const betResult =
    foundPlayer.setBet(chipsToBet);

    this.pot = this.pot + chipsToBet;

    log.add({
      thisBet: {
        gameId: this.gameId,
        playerId: foundPlayer.getPlayerId(),
        thisGameBet: foundPlayer.getThisGameBet(),
      },
    });
  }

  startGame() {
    console.log("MATCH - startGame");

    this.dealer.dealCardsDealer(3);

    log.add({ dealerCards: this.dealer.showCards() });
  }
}

module.exports = new Match();
