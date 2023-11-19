class StepChecker {
  gameFlowOriginal = {
    gameId: "",
    signUp: false,
    bigBlind: false,
    smallBlind: false,
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
}

module.exports = StepChecker;
