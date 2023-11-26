class Player {
  constructor(gameId, name, chips, cards, id) {
    this.name = name;
    this.id = id;
    this.gameId = gameId;
    this.viewCards = false;
    this.chips = chips;
    this.cards = cards;
  }

  currentBet = 0;

  setCard(card) {
    this.cards.push(card);
  }

  getCards(){
    return this.cards
  }

  countCards() {
    return this.cards.length;
  }

  viewCards() {
    return (this.viewCards = true);
  }

  getPlayer(playersArray, playerId) {
    return playersArray.find((player) => player.id === playerId);
  }

  getPlayerId = () => {
    return this.id;
  };

  getChips = () => {
    return this.chips;
  };

  getCurrentBet = () => {
    return this.currentBet;
  };

  setBet(chipsToBet) {
    let betSet = false;
    if (Number(chipsToBet) > Number(this.chips)) {
      // return "no enough chips";
    } else {
      this.chips -= chipsToBet;
      this.currentBet += chipsToBet;
      betSet = true;
    }
    return betSet;
  }

  showCards() {
    console.log("player - showCards");
    console.log("player cards", this.cards);
  }
}

module.exports = Player;
