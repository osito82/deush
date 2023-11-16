class Log {
  constructor() {
    this.logEntries = [];
    //this.name = name;
    //   this.totalChips = totalChips;
    //   this.cards = cards;
    //   console.log("PLAYER", name, "cards:", cards);
  }

  add(item) {
    console.log(item, "xxx");
    console.log(item.id, "xxx");

    //  const existingIndex = this.logEntries.findIndex(entry => entry.id === item.id);

    const timestamp = new Date();
    const timeString = timestamp.toLocaleTimeString();
    const dateTime = `${timestamp.toLocaleDateString()} ${timeString}`
    //    if (existingIndex !== -1) {
    // Si ya existe un objeto con el mismo ID, actualiza la información

    //    this.logEntries[existingIndex] = { item };
    //  } else {
    // Si no existe, agrega un nuevo objeto al log

    this.logEntries.push(dateTime + " - " + JSON.stringify(item));
    //  }
  }

  print() {
    console.log("******** LOG ***************");
    console.log(this.logEntries);
    // this.logEntries.forEach(entry => {
    //   console.log("Timestamp:", entry.timestamp);
    //   console.log("Players:", JSON.stringify(entry.players));
    //   console.log("******** *** ***************");
    // });
  }
}

//receives cards
// setCard(card) {
//   this.cards.push(card);
// }

//   //get number how many cards
//   countCards() {
//     return this.cards.length
//   //  this.cards.push(card);
//   }

// // Método para obtener un jugador por su ID
// getPlayer(playersArray, playerId) {
//   return playersArray.find((player) => player.id === playerId);
// }
// //}
// setBet(chipsToBet) {
//   let betSet = false
//   if (chipsToBet > this.totalChips) {
//     return "no enough chips";
//   } else {
//     this.totalChips -= chipsToBet;
//     betSet = true
//   }
//   return betSet
// }
// //}

// showCards() {
//   console.log("player - showCards");
//   //console.log(this.originalDeck);
//   //  console.log(this.players[0].chips, "players");
//   console.log("player cards", this.cards);
// }
//}

module.exports = Log;
