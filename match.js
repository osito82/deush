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

  signUpPlayer(data, thisSocketId) {
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
      thisSocketId
    );
    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisSocketId
    );

    const playerNumber = this.players.length + 1;

    player.setPlayerNumber(playerNumber);

    if (!foundPlayer) this.players.push(player);
  }

  dealtPrivateCards() {
    console.log("MATCH - dealtPrivateCards");
    this.dealer.dealCardsEachPlayer(2);
  }

  askForBets() {
    //todo
  }

  initialBet(thisSocketId, chipsToBet) {
    console.log("MATCH - initialBet");
    if (R.isEmpty(this.players)) {
      return;
    }

    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisSocketId
    );

    foundPlayer.setBet(chipsToBet);

    this.pot = this.pot + chipsToBet;

    log.add({
      thisBet: {
        gameId: this.gameId,
        playerId: foundPlayer.getPlayerId(),
        thisGameBet: foundPlayer.getThisGameBet(),
        chips: foundPlayer.getChips(),
      },
    });
  }

  startGame() {
    console.log("MATCH - startGame");

    //smallBlind Ask for bet P1
    this.dealer.talkToPLayer(1, "P1 - Please make your bet");
    //bigBlind Ask for bet P2
    this.dealer.talkToPLayer(2, "P2 - Please make your bet");

    this.dealer.dealCardsDealer(3);

    log.add({ dealerCards: this.dealer.showCards() });
  }
}

module.exports = new Match();
