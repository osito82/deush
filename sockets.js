const log = require("./log");
class Socket {
    static socketsArray = [];
  
    static addSocket(socket) {
      this.socketsArray.push(socket);
      log.add({ addSocket: socket.id });
    }
  
    static getSocket(id) {
      return this.socketsArray.find((socket) => socket.id === id);
    }
  }
  
  module.exports = Socket;
  