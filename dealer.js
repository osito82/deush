//const { cards, dealCards } = require("./deck");
// const Log = require("./log");
// const log = new Log();
///const log = require("./log");
class Dealer {
  
  constructor(chips, players, deck) {
    this.id = "0001P";
    this.deck = deck;
    this.chips = chips;
    this.players = players;
    console.log("DEALER", "deck:", deck, "players", players);
  }

  cards = [];

  dealCardsEachPlayer(numberOfCards = 1) {
    for (let i = 0; i < numberOfCards; i++) {
      this.players.forEach((player) => {
      
       // console.log('cerotes', player.countCards()  )
        if (player.countCards() >= 2) return;

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
 //   log.add('dealerCards','xxx')
    //log.add('dealerCards', this.showCards())
  }

  setCard(card) {
    this.cards.push(card);
  }

  dealCards() {
    console.log("dealer - dealCards");

    const burnedCard = this.deck.shift();
    this.deck.push(burnedCard); //

    this.dealCardsEachPlayer(2);
  }

  showCards() {
   // console.log('sssssssshpw', this.cards)
   //log.
    return this.cards;
    // console.log("dealer - showCards");
    // console.log("dealer deck", this.deck);
    // console.log("dealer cards ", this.cards);
  }
}

module.exports = Dealer;
