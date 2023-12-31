//Development File
const {
  notRepeatedInIntArray,
  highestCardNumberFromArray,
} = require("./utils");

//const { shuffle } = require("./utils");
const Deck = require("./deck");
const PokerCore = require("./pokerCore");
const WinnerCore = require("./winnerCore");
const shuffledDeck = Deck.shuffleDeck(Deck.cards, 101);

const deal = (number, cardsPractice) => {
  return cardsPractice.splice(0, number);
};

const dealerCards = deal(5, shuffledDeck);
const playerCards = deal(2, shuffledDeck);

const fOaK = ["8h", "8c", "2c", "8s", "8d"];
const flush = ["8h", "7h", "6h", "5h", "2h"];
const straightFlush = ["9h", "Jh", "Qh", "Kh", "Th"];
const royalFlush = ["Ah", "Jh", "Qh", "Kh", "Th"];
const fullHouse = ["Ah", "As", "Qh"];
const fullHouseD = ["Ks", "Td"];
const HighCard = ["1h", "2s", "3h"];

//let contadorFullHouse = 0;

let bestHands = [];

for (let i = 0; i < 500000 / 15; i++) {
  const deck = [...Deck.shuffleDeck(Deck.cards, 100)];

  const deal = (number, cardsPractice) => {
    return cardsPractice.splice(0, number);
  };

  const dealerCards = deal(5, deck);
  const playerCards = deal(2, deck);

  const resultado = PokerCore.betterHand(dealerCards, playerCards);

  //10
  //highCard
  //if (resultado.pokerHand == "highCard") bestHands.push(resultado);

  //9
  //if (resultado.pokerHand == "pairs")  bestHands.push(resultado);

  //8
  if (resultado.pokerHand == "twoPairs") bestHands.push(resultado);

  //7
  //if (resultado.pokerHand == "threeOfAKind")   bestHands.push(resultado);

  //6
  //if (resultado.pokerHand == "straight") bestHands.push(resultado);

  //5
  //if (resultado.pokerHand == "flush") bestHands.push(resultado);

  //4
  //if (resultado.pokerHand == "fullHouse") bestHands.push(resultado);

  //3
  //fourOfaKind
  //if (resultado.pokerHand == "fourOfaKind") bestHands.push(resultado);

  //2
  //straightFlush
  //if (resultado.pokerHand == "straightFlush") bestHands.push(resultado);

  //1
  //RoyalFlush
  //if (resultado.pokerHand == "royalFlush") bestHands.push(resultado);

  //console.log(resultado)
  //   bestHands.push(resultado);
}

//console.dir(bestHands);

console.log(WinnerCore.Winner(bestHands));
