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

  signUpPlayer(data, id) {
    console.log("signUpPlayer");
    const player = new Player(this.gameId, data.name, data.totalChips, [], id);
    const foundPlayer = this.players.find((myPlayer) => myPlayer.id == id);
    if (!foundPlayer) this.players.push(player);
  }

  dealtPrivateCards() {
    console.log("2 - dealtPrivateCards");
    this.dealer.dealCardsEachPlayer(2);
  }

  initialBet(player, chipsToBet) {
    console.log("MATCH - initialBet");
    if (R.isEmpty(this.players)) {
      //todo -> send mensaje consola
      return;
    }

    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == player.id
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
    //  console.log(betResult);
    //  console.log(foundPlayer);
    // }
  }

  startGame() {
    console.log("startGame");

    this.dealer.dealCardsDealer(3);
    //console.log(this.dealer.showCards())
    log.add({ dealerCards: this.dealer.showCards() });
  }
}

module.exports = new Match();
