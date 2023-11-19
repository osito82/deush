//const log = require("./log");
//console.log('steeep')
class StepChecker {
  gameFlowOriginal = {
    gameId: "",
    signUp: false,
  };

  constructor(gameId) {
    //console.log(gameId, "************");
    this.gamesArray = [];
    this.gameFlow = { ...this.gameFlowOriginal };
    this.gameFlow.gameId = gameId;
  }

  checkStep(step) {
    console.log(this.gameFlow, "----------------");
    console.log(this.gameFlow);
    return this.gameFlow[step] || false;
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
