const Player = require("./player");
const Dealer = require("./dealer");
const Deck = require("./deck");
const StepChecker = require("./stepChecker");

const R = require("radash");
const log = require("./log");
const { generateUniqueId } = require("./utils");

class Match {
  constructor() {
    this.gameId = generateUniqueId();
    this.pot = 0;
    this.players = [];
    this.shuffledDeck = Deck.shuffleDeck(Deck.cards, 101);
    this.dealer = new Dealer(this.gameId, this.players, this.shuffledDeck);
    this.stepChecker = new StepChecker(this.gameId);
  }

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

    if (playerNumber >= 2) this.stepChecker.passedStep("signUp");

    if (!foundPlayer) this.players.push(player);
  }

  dealtPrivateCards() {
    console.log("MATCH - dealtPrivateCards");
    this.dealer.dealCardsEachPlayer(2);

    log.add({ players: this.players });
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
      initialBet: {
        player: foundPlayer,
        pot: this.pot,
      },
    });
  }

  askForBets(bettingFor) {
    console.log("MATCH - askForBets");

    if (bettingFor == "blinds") {
      //smallBlind Ask for bet P1
      if (!this.dealer.hasPlayerBet(1))
        this.dealer.talkToPLayer(1, "P1 - Please make your bet");
      //bigBlind Ask for bet P2
      if (!this.dealer.hasPlayerBet(2))
        this.dealer.talkToPLayer(2, "P2 - Please make your bet");

      if (this.dealer.hasPlayerBet(1) && this.dealer.hasPlayerBet(2)) {
        return "{blinds:1}";
      }
    }
  }

  step_betsOnBlinds() {
    this.askForBets("blinds");
  }

  startGame() {
    console.log("MATCH - startGame");

    if (!this.stepChecker.checkStep("signUp")) {
      this.dealer.talkToAllPlayers("Minimun 2 Players to Start");
    }

    //todo si
    if (this.dealer.hasPlayerBet(1) && this.dealer.hasPlayerBet(2))
      this.dealer.dealCardsDealer(3);

    log.add({ dealerCards: this.dealer.showCards() });
  }
}

module.exports = new Match();
