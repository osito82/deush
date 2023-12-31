const Socket = require("./sockets");

class Dealer {
  constructor(gameId, players, deck, torneoId, pot, cardsDealer) {
    this.gameId = gameId;
    this.torneoId = torneoId;
    this.deck = deck;
    this.players = players;
    this.pot = pot;
    this.cardsDealer = cardsDealer;
  }

  pot = 0;
  playersChecked = [];
  finalHands = [];

  setFinalHands = () => {
    let currentPrize = {};
    console.log("DEALER - setFinalHands");
    this.players.forEach((player) => {
      currentPrize = player.getCurrentPrize();
      currentPrize.name = player.name;
      currentPrize.playerId = player.id;
      currentPrize.gameId = player.gameId;

      this.finalHands.push({
        ...currentPrize,
      });
    });
        //osito


  };

  getFinalHands = () => {
    return this.finalHands;
  };

  allPlayersCheck = () => {
    return this.players.every((player) =>
      this.playersChecked.includes(player.id)
    );
  };

  getPlayersChecked = () => {
    return this.playersChecked;
  };

  removeChecks = () => {
    console.log("removeChecks");
    this.playersChecked = [];
  };

  setChecked = (thisSocketId) => {
    this.playersChecked.push(thisSocketId);
  };

  setPot(chipsToBet) {
    this.pot = this.pot + chipsToBet;
  }

  getPot() {
    return this.pot;
  }

  getChipsFromPlayers = () => {
    console.log("DEALER - getChipsFromPlayers");
    this.players.forEach((player) => player.giveChipsToDealer());
  };

  dealCardsEachPlayer = (numberOfCards = 1) => {
    for (let i = 0; i < numberOfCards; i++) {
      this.players.forEach((player) => {
        if (player.countCards() == 2) return;

        const cardToDeal = this.deck.shift();
        if (cardToDeal) {
          player.setCard(cardToDeal);
        } 
      });
    }
  };

  dealCardsDealer(numberOfCards = 1) {
    for (let i = 0; i < numberOfCards; i++) {
      const cardToDeal = this.deck.shift();
      if (cardToDeal) {
        this.setCard(cardToDeal);
      }
    }
  }

  getDealerCards() {
    return this.cardsDealer;
  }

  setCard(card) {
    this.cardsDealer.push(card);
  }

  hasMinimunPlayers() {
    return this.players.length >= 2;
  }

  getPlayerByNumber(number) {
    const idx = Number(number) - 1;
    const foundPlayer = this.players[idx];

    if (foundPlayer) {
      return foundPlayer;
    } else {
      return null;
    }
  }

  getPlayerById(number) {
    const foundPlayer = this.players.find((myPlayer) => myPlayer.id === number);
    if (foundPlayer) {
      return foundPlayer;
    } else {
      return null;
    }
  }

  hasPlayerBetByNumber = (playerNUmber) => {
    const playerToCheck = this.getPlayerByNumber(playerNUmber);
    if (playerToCheck) {
      if (playerToCheck.getCurrentBet() == 0) return false;
      return true;
    }
  };

  hasPlayerBet(player) {
    if (player) {
      return player.getCurrentBet() !== 0;
    } else {
      return false;
    }
  }

  hasAllPlayersBet = () => {
    const res = this.players.every((player) => {
      return Number(player.getCurrentBet()) !== 0;
    });

    return res;
  };

  talkToPLayerById(idNumber, targetMessage) {
    try {
      const foundPLayer = this.getPlayerById(idNumber);

      if (foundPLayer) {
        const targetSocket = Socket.getSocket(this.torneoId, idNumber);
        targetSocket.socket.send(JSON.stringify({ message: targetMessage }));
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  ///Sends Message to all player But not for One
  talkToPlayerBUTid(idToOmitNumber, targetMessage) {
    try {
      this.players.forEach((player) => {
        const { id } = player;

        if (id && id !== idToOmitNumber) {
          this.talkToPLayerById(id, targetMessage);
        } else {
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  talkToSocketById(idNumber, targetMessage) {
    console.log("DEALER - talkToSocketById ");
    try {
      const allSockets = Socket.getSocketsByTorneo(this.torneoId);
      if (allSockets) {
        const targetSocket = Socket.getSocket(this.torneoId, idNumber);
        targetSocket.socket.send(JSON.stringify({ message: targetMessage }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  talkToPLayerByNumber(playerNumber, targetMessage) {
    try {
      const foundPlayer = this.getPlayerByNumber(playerNumber);

      if (foundPlayer) {
        const playerId = foundPlayer.id;
        const targetSocket = Socket.getSocket(this.torneoId, playerId);
        if (targetSocket) {
          targetSocket.socket.send(JSON.stringify({ message: targetMessage }));
        } else {
          console.log("There is not socket for player" + playerId);
        }
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  ///Send Same Message to all the players who are playing
  talkToAllPlayersOnTable(targetMessage) {
    try {
      this.players.forEach((player) => {
        const { id } = player;

        const socket = Socket.getSocket(this.torneoId, id);

        if (socket) {
          socket.socket.send(JSON.stringify({ message: targetMessage }));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  ///Talk to all sockets in the torneo
  talkToAllSockets(targetMessage) {
    console.log("MATCH - talkToAllSockets ");
    try {
      const allSockets = Socket.getSocketsByTorneo(this.torneoId);
      if (allSockets) {
        allSockets.forEach((thisSocket) => {
          thisSocket.socket.send(JSON.stringify({ message: targetMessage }));
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Dealer;
