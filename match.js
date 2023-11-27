const Player = require("./player");
const Dealer = require("./dealer");
const Deck = require("./deck");
const StepChecker = require("./stepChecker");
const osolog = require("osolog");

const PokerCore = require("./pokerCore");

const R = require("radash");
const Socket = require("./sockets");
const Communicator = require("./communicator");

const { msgBuilder } = require("./utils");

class Match {
  log = new osolog();

  constructor(torneoId, gameId) {
    this.torneoId = torneoId;
    this.gameId = gameId;

    this.players = [];
    this.playersFold = [];
    this.pot = 0;

    this.dealer = new Dealer(
      this.gameId,
      this.players,
      (this.shuffledDeck = Deck.shuffleDeck(Deck.cards, 101)),
      torneoId,
      this.pot
    );

    this.stepChecker = new StepChecker(this.gameId);

    this.communicator = new Communicator(
      this.gameId,
      this.torneoId,
      this.playersFold,
      this.stepChecker,
      this.players,
      this.dealer
    );
  }

  signUp(data, thisSocket) {
    const { id: thisSocketId } = thisSocket;
    console.log("MATCH - signUp");

    ///Avoid Folders to play when startGame = true
    if (
      this.stepChecker.checkStep("startGame") &&
      this.playersFold.includes(data.name)
    ) {
      console.log("Todo, Folders cannot get in during match in progresss");
      return;
    }

    if (this.players.length >= 10) {
      console.log("Max Ten Players");
      return;
    }

    const player = new Player(
      this.gameId,
      data.name,
      data.totalChips,
      [],
      thisSocketId
    );

    const existingPlayerIndex = this.players.findIndex(
      (s) => s.name === data.name
    );

    if (existingPlayerIndex !== -1) {
      this.players[existingPlayerIndex].id = player.id;
      console.log(`Usuario ${data.name} se ha reconectado.`);

      if (this.stepChecker.checkStep("pause")) {
        this.dealer.talkToAllPlayersOnTable(`${data.name} ya volvio`);
        this.stepChecker.revokeStep("pause");
        this.continue(thisSocket);
      }
    } else {
      this.players.push(player);
      console.log(`Nuevo usuario ${data.name} ha sido agregado.`);

      this.communicator.msgBuilder("signUp", "public", player, {});

      this.dealer.talkToAllPlayersOnTable(this.communicator.getMsg());

      this.log
        .Template({ name: "brakets", date: true, title: "signUp" })
        .R(this.communicator.getFullInfo());
    }

    if (this.players.length >= 2) {
      this.stepChecker.grantStep("signUp");
    } else {
      this.stepChecker.revokeStep("signUp");
    }

    return;
  }

  dealtPrivateCards(thisSocket) {
    const { id: thisSocketId } = thisSocket;
    console.log("MATCH - dealtPrivateCards");
    try {
      //    const foundPlayer = this.dealer.getPlayerById(thisSocketId);

      this.dealer.dealCardsEachPlayer(2);
      this.stepChecker.grantStep("dealtPrivateCards");

      ///Sends a customized msg
      for (const player of this.players) {
        this.communicator.msgBuilder(
          "dealtPrivateCards",
          "private",
          player,
          {}
        );

        this.dealer.talkToPLayerById(player.id, this.communicator.getMsg());
      }

      this.log
        .Template({ name: "brakets", date: true, title: "dealtPrivateCards" })
        .R(this.communicator.getFullInfo());

      this.continue(thisSocket);
      //     }
    } catch (error) {
      console.error("Error in dealtPrivateCards:", error);
    }
  }

  setBet(thisSocket, chipsToBet, type = "setBet") {
    const { id: thisSocketId } = thisSocket;
    console.log("MATCH - " + type);

    if (R.isEmpty(this.players)) {
      return;
    }

    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisSocketId
    );
    if (foundPlayer) {
      const aprovedBet = foundPlayer.setBet(chipsToBet);

      if (aprovedBet) {
        this.dealer.setPot(chipsToBet);

        this.communicator.msgBuilder("setBet", "public", foundPlayer, {});
        this.dealer.talkToAllPlayersOnTable(this.communicator.getMsg());
        this.log
          .Template({ name: "brakets", date: true, title: "setBet" })
          .R(this.communicator.getFullInfo());
      } else {
        console.log("todo - setBet  was not possible");
      }
    }
    this.continue(thisSocket);
  }

  setCall(thisSocket) {
    console.log("MATCH - setCall");

    const maxBet = Math.max(
      ...this.players.map((player) => player.getCurrentBet())
    );

    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisSocket.id
    );

    if (!foundPlayer) {
      return;
    }

    const currentBet = foundPlayer.getCurrentBet();

    if (currentBet < maxBet) {
      const diff = maxBet - currentBet;
      const aprovedBet = foundPlayer.setBet(diff);

      if (aprovedBet) {
        this.dealer.setPot(diff);

        this.communicator.msgBuilder("setCall", "public", foundPlayer, {});
        this.dealer.talkToAllPlayersOnTable(this.communicator.getMsg());
        this.log
          .Template({ name: "brakets", date: true, title: "setCall" })
          .R(this.communicator.getFullInfo());
      } else {
        console.log("todo - rise was not possible");
      }
    }

    this.continue(thisSocket);
  }

  setCheck(thisSocket) {
    console.log("MATCH - setCheck");

    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisSocket.id
    );

    if (foundPlayer) {
      this.communicator.msgBuilder("setCheck", "public", foundPlayer, {});
      this.dealer.talkToAllPlayersOnTable(this.communicator.getMsg());
      this.log
        .Template({ name: "brakets", date: true, title: "setCheck" })
        .R(this.communicator.getFullInfo());
    }
  }

  setRise(thisSocketId, chipsToBet) {
    console.log("MATCH - setRise");
    this.setBet(thisSocketId, chipsToBet, "setRise");
  }

  askForBets(bettingFor, thisSocket) {
    console.log("MATCH - askForBets");
    if (bettingFor == "blinds") {
      if (this.dealer.hasPlayerBet(1) && this.dealer.hasPlayerBet(2)) {
        this.stepChecker.grantStep("blinds");
        this.continue(thisSocket);
      } else {
        ///blinds Ask for bet P1
        if (!this.dealer.hasPlayerBet(1)) {
          this.dealer.talkToPLayerByNumber(
            1,
            "P1 - Please make your blind bet"
          );
        }

        ///blinds Ask for bet P2
        if (!this.dealer.hasPlayerBet(2)) {
          this.dealer.talkToPLayerByNumber(
            2,
            "P2 - Please make your blind bet"
          );
        }
      }
    }
  }

  playerLeave(thisSocket) {
    const { id: thisSocketId } = thisSocket;
    console.log("MATCH - playerLeave");
    const index = this.players.findIndex(
      (player) => player.id === thisSocketId
    );
    if (index !== -1) {
      this.players.splice(index, 1);
    }
    this.continue(thisSocket);
  }

  fold(thisSocket) {
    const { id: thisSocketId } = thisSocket;
    console.log("MATCH - fold");
    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.id == thisSocketId
    );

    if (foundPlayer && foundPlayer.cards.length > 0) {
      this.playersFold.push(foundPlayer.name);

      const msg = msgBuilder("fold", "personal", foundPlayer, {});
      this.dealer.talkToPLayerById(thisSocketId, msg);

      this.communicator.msgBuilder("fold", "public", foundPlayer, {});
      this.dealer.talkToAllPlayersOnTable(this.communicator.getMsg());
      this.log
        .Template({ name: "brakets", date: true, title: "fold" })
        .R(this.communicator.getFullInfo());

      const index = this.players.findIndex(
        (player) => player.id === thisSocketId
      );

      if (index !== -1) {
        this.players.splice(index, 1);
      }
    }

    this.continue(thisSocket);
  }

  close(thisSocket, torneoId) {
    console.log("MATCH - close");
    const { id: thisSocketId } = thisSocket;

    ///Remove User from Users Array
    const index = this.players.findIndex(
      (player) => player.id === thisSocketId
    );

    if (index !== -1) {
      this.players.splice(index, 1);
    }

    /// Close socket after removing user information
    if (thisSocket) {
      Socket.removeSocket(thisSocket, torneoId);
      thisSocket.socket.close();
    }
  }

  vigilant() {
    // console.log("vigilant");
  }

  pause(thisSocket) {
    console.log("MATCH - pause");
    this.dealer.talkToAllPlayersOnTable(
      `The user ${thisSocket.name} - ${thisSocket.id} got disconnected`
    );
    this.stepChecker.grantStep("pause");

    setTimeout(() => {
      this.stepChecker.revokeStep("pause");
      this.playerLeave(thisSocket);
      this.dealer.talkToAllPlayersOnTable(
        `Player ${thisSocket.name} - ${thisSocket.id} didnt come back, lets continue`
      );
      //this.startGame();
    }, 15000);
    this.continue(thisSocket);
  }

  continue(thisSocket) {
    console.log("MATCH - continue");
    this.startGame(thisSocket);
  }

  bettingCore(bettingFor) {
    console.log("MATCH - bettingCore");
    try {
      const maxBet = Math.max(
        ...this.players.map((player) => player.getCurrentBet())
      );
      const currentBets = this.players.map((player) => player.getCurrentBet());
      const allBetsEqual = currentBets.every((bet) => bet === currentBets[0]);

      if (!allBetsEqual) {
        this.players.forEach((player) => {
          const currentBet = player.getCurrentBet();

          if (currentBet != maxBet) {
            this.communicator.msgBuilder("bettingCore", "private", player, {
              messageForName: player.getPlayerName(),
              messageForId: player.getPlayerId(),
              action: ["call", "rise", "fold"],
              currentBet: currentBet,
              maxBet: maxBet,
            });
            this.dealer.talkToPLayerById(
              player.getPlayerId(),
              this.communicator.getMsg()
            );

            this.communicator.msgBuilder("bettingCore", "public", player, {
              messageForName: player.getPlayerName(),
              messageForId: player.getPlayerId(),
              action: ["call", "rise", "fold"],
            });
            this.dealer.talkToPlayerBUTid(
              player.getPlayerId(),
              this.communicator.getMsg()
            );

            this.log
              .Template({ name: "brakets", date: true, title: "bettingCore" })
              .R(this.communicator.getFullInfo());
          }
        });

        ///First Betting
        if (bettingFor === "firstBetting") {
          this.stepChecker.revokeStep("firstBetting");
        }
      } else {
        if (bettingFor === "firstBetting") {
          this.stepChecker.grantStep("firstBetting");
        }
      }
    } catch (error) {
      console.log(error);
    }
    //this.continue()
  }

  startGame(thisSocket = {}) {
    console.log("MATCH - startGame");

    const { id: thisSocketId } = thisSocket;

    ///Avoid Folded Players to ReEnter
    const foundPlayerFold = this.playersFold.find(
      (foldPlayerNames) => foldPlayerNames == thisSocket.name
    );

    if (foundPlayerFold) {
      const msg = msgBuilder(
        "startGame",
        "personal",
        { name: foundPlayerFold },
        {
          date: "No Re-enter after fold",
        }
      );
      this.dealer.talkToSocketById(thisSocketId, msg);
      return;
    }

    ///Pause
    if (this.stepChecker.checkStep("pause")) {
      this.dealer.talkToAllPlayersOnTable("We are on pause");
      return;
    }

    ///Check Minimun Players
    if (!this.dealer.hasMinimunPlayers()) {
      this.dealer.talkToAllPlayersOnTable("Minimun 2 Players to Start");
      return;
    }

    ///Blinds
    if (!this.stepChecker.checkStep("blinds")) {
      this.askForBets("blinds", thisSocket);
      return;
    }

    ///Deal Private Cards
    if (!this.stepChecker.checkStep("dealtPrivateCards")) {
      this.dealtPrivateCards(thisSocket);
      return;
    }

    ///firstBetting
    if (!this.stepChecker.checkStep("firstBetting")) {
      this.bettingCore("firstBetting");
      return;
    }

    //log.add({ dealerCards: this.dealer.showCards() });

    this.stepChecker.grantStep("startGame");
  }

  stats(socketId) {
    console.log(socketId);
    console.log("Players", JSON.stringify(this.players));
    console.log("Sockets", Socket.getSockets());
    console.log("pot", this.dealer.getPot());
    console.log("gameFlow", JSON.stringify(this.stepChecker.gameFlow));
  }
}

module.exports = Match;
