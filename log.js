class Log {
  constructor() {
    this.logEntries = [];
    //this.name = name;
    //   this.totalChips = totalChips;
    //   this.cards = cards;
    //   console.log("PLAYER", name, "cards:", cards);
  }

  add(item) {
    const timestamp = new Date();
    const timeString = timestamp.toLocaleTimeString();
    const dateTime = `${timestamp.toLocaleDateString()} ${timeString}`;
    const itemWithoutSocket = { ...item };

    //console.log(item, '15551545 0021')
    if (itemWithoutSocket.hasOwnProperty('socket')) {
        delete itemWithoutSocket.socket;
      }

//console.log(item, 'xxxxxxxxxx4')


    this.logEntries.push(dateTime + " - " + JSON.stringify(itemWithoutSocket));
    //  }
  }


get(){
   // const strToSend = this.logEntries.join(',')
   // console.log(strToSend, '---------')
   // return strToSend
}

  print() {
    console.log("******** LOG ***************");
    //console.log(this.logEntries);
    this.logEntries.forEach((entry) => {
      //   console.log("Timestamp:", entry.timestamp);
      //   console.log("Players:", JSON.stringify(entry.players));
      console.log(entry);
      //   console.log("******** *** ***************");
    });
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

module.exports = new Log();
