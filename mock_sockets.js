//Player signUp - 1
const signUp = {
  name: "osito",
  action: "signUp",
  totalChips: 1000,
};

//Start the game
const dealtPrivateCards = {
  action: "dealtPrivateCards",
};

//Player Initial Bet
const initialBet = {
  chipsToBet: 20,
  action: "initialBet",
};

//Start the game
const startGame = {
  action: "startGame",
};

//Log
const log = {
  action: "log",
};

//Player Ask
const askCard = {
  action: "askCard",
  bet: 20,
};

exports.askCard = askCard;
exports.signUp = signUp;
exports.startGame = startGame;
exports.initialBet = initialBet;
exports.dealtPrivateCards = dealtPrivateCards;
exports.log = log;
