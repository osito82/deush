const Socket = require("./sockets");

class Dealer {
  constructor(gameId, players, deck) {
    this.gameId = gameId;
    this.deck = deck;

    this.players = players;
  }

  cards = [];

  dealCardsEachPlayer(numberOfCards = 1) {
    //console.log(this.players, '-------')
    for (let i = 0; i < numberOfCards; i++) {
      this.players.forEach((player) => {
        // console.log('cerotes', player.countCards()  )
        if (player.countCards() == 2) return;

        const cardToDeal = this.deck.shift();
        if (cardToDeal) {
          player.setCard(cardToDeal);
        } else {
          console.log("No hay cartas suficientes en el mazo.");
        }
      });
    }
  }

  dealCardsDealer(numberOfCards = 1) {
    for (let i = 0; i < numberOfCards; i++) {
      const cardToDeal = this.deck.shift();
      if (cardToDeal) {
        this.setCard(cardToDeal);
      } else {
        console.log("No hay cartas suficientes en el mazo.");
      }
    }
  }

  setCard(card) {
    this.cards.push(card);
  }

  dealCards() {
    console.log("dealer - dealCards");

    const burnedCard = this.deck.shift();
    this.deck.push(burnedCard);

    this.dealCardsEachPlayer(2);
  }

  hasMinimunPlayers() {
    return this.players.length >= 2;
  }

  getPlayerByNumber(number) {
    console.log("dealer - getPlayerByNumber");
    const foundPlayer = this.players.find(
      (myPlayer) => myPlayer.playerNumber == number
    );
    return foundPlayer;
  }

  hasPlayerBet(playerNUmber) {
    const playerToCheck = this.getPlayerByNumber(playerNUmber);
    if (playerToCheck) {
      return playerToCheck.getThisGameBet() !== 0;
    } else {
      return 0;
    }
  }

  talkToPLayer(playerNumber, targetMessage) {
    try {
      const foundPlayer = this.getPlayerByNumber(playerNumber);

      if (foundPlayer) {
        console.log("MATCH - talkToPLayer" + playerNumber);
        const playerId = foundPlayer.id;
        const targetSocket = Socket.getSocket(playerId);
        targetSocket.socket.send(JSON.stringify({ message: targetMessage }));
      }
    } catch (error) {
      console.log(error); 
    }
  }

  talkToAllPlayers(targetMessage) {
    try {
      for (const player of this.players) {
        const playerId = player.id;
        const targetSocket = Socket.getSocket(playerId);
        targetSocket.socket.send(JSON.stringify({ message: targetMessage }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  showCards() {
    return this.cards;
  }
}

module.exports = Dealer;
