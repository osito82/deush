class Player {
  constructor(name, totalChips, cards, id) {
    this.id = id;
    this.name = name;
    this.totalChips = totalChips;
    this.cards = cards;
    console.log("PLAYER", name, "cards:", cards);
    
  }

  //receives cards
  setCard(card) {
    this.cards.push(card);
  }

    //get number how many cards
    countCards() {
      return this.cards.length
    //  this.cards.push(card);
    }

  // Método para obtener un jugador por su ID
  getPlayer(playersArray, playerId) {
    return playersArray.find((player) => player.id === playerId);
  }
  //}
  setBet(chipsToBet) {
    let betSet = false
    if (chipsToBet > this.totalChips) {
      return "no enough chips";
    } else {
      this.totalChips -= chipsToBet;
      betSet = true
    }
    return betSet
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
