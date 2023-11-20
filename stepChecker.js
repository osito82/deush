const { signUp } = require("./mock_sockets");

class StepChecker {
  gameFlowOriginal = {
    gameId: "",
    signUp: false,
    bigBlind: false,
    smallBlind: false,
    dealPrivateCards: false,
  };

  constructor(gameId) {
    this.gamesArray = [];
    this.gameFlow = { ...this.gameFlowOriginal };
    this.gameFlow.gameId = gameId;
  }

  checkStep(step) {
    return step in this.gameFlow ? this.gameFlow[step] : false;
  }

  passedStep(step) {
    this.gameFlow[step] = true;
    return this;
  }

  reset() {
    this.gameFlow = { ...this.gameFlowOriginal };
  }

  isAllowedTo(step) {
    switch (step) {
      case "bigBlind":
      case "smallBlind":
      case "blinds":
        return this.checkStep("signUp");
      //   break;
      case "dealPrivateCards":
        return (
          this.checkStep("signUp") &&
          this.checkStep("smallBlind") &&
          this.checkStep("bigBlind")
        );
        //break;
    }
  }
}

module.exports = StepChecker;
