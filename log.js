class Log {
  constructor() {
    this.logEntries = [];
  }

  add(item) {
    const timestamp = new Date();
    const timeString = timestamp.toLocaleTimeString();
    const dateTime = `${timestamp.toLocaleDateString()} ${timeString}`;
    const itemWithoutSocket = { ...item };

    this.logEntries.push(dateTime + " - " + JSON.stringify(itemWithoutSocket));
  }

  get() {
    const strToSend = this.logEntries.join(",");
    return strToSend;
  }

  print() {
    console.log("*************** LOG ***************");

    this.logEntries.forEach((entry) => {
      console.log(entry);
    });
  }
}

module.exports = new Log();
