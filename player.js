class Player {
  constructor(gameId, name, chips, cards, id) {
    this.gameId = gameId;
    this.id = id;
    this.name = name;
    this.chips = chips;
    this.cards = cards;
  }
  playerNumber = 0;
  thisGameBet = 0;
  
  //receives cards
  setCard(card) {
    this.cards.push(card);
  }

  setPlayerNumber(number) {
    this.playerNumber = number;
  }

  //get number how many cards
  countCards() {
    return this.cards.length;
    //  this.cards.push(card);
  }

  // Método para obtener un jugador por su ID
  getPlayer(playersArray, playerId) {
    return playersArray.find((player) => player.id === playerId);
  }

  getPlayerId = () => {
    return this.id;
  };
  getThisGameBet = () => {
    return this.thisGameBet;
  };
  //}
  setBet(chipsToBet) {
    let betSet = false;
    if (chipsToBet > this.chips) {
      return "no enough chips";
    } else {
      this.chips -= chipsToBet;
      this.thisGameBet += chipsToBet;
      betSet = true;
    }
    return betSet;
  }
  //}

  showCards() {
    console.log("player - showCards");
    //console.log(this.originalDeck);
    //  console.log(this.players[0].chips, "players");
    console.log("player cards", this.cards);
  }
}

module.exports = Player;
