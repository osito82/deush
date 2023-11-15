const WebSocket = require("ws");
const readline = require("readline");
const mockTest = require("../mock_sockets");

const socket = new WebSocket("ws://localhost:3333");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.addEventListener("open", (event) => {
  console.log("Conexión establecida con el servidor");

  // Función para enviar un comando al servidor
  const sendCommand = (command) => {
    socket.send(JSON.stringify(command));
  };

  // Función para manejar el comando ingresado
  const handleCommand = (command) => {
    switch (command) {
      case "signUp":
      case "initialBet":
      case "startGame":
      case "askCard":
        sendCommand(mockTest[command]);
        break;
      case "close":
        console.log("Cerrando conexión.");
        socket.close();
        rl.close(); // Cerrar la interfaz de línea de comandos
        break;
      default:
        console.log("Comando no reconocido");
    }
  };

  // Función para solicitar un comando y manejarlo
  const promptCommand = () => {
    rl.question(
      "Ingrese un comando: ",
      (command) => {
        handleCommand(command);
        if (command !== "cerrar" && command !== "close") {
            promptCommand();
        }
      }
    );
  };

  
  promptCommand();
});

socket.addEventListener("message", (event) => {
  console.log(`Mensaje del servidor: ${event.data}`);
});

socket.addEventListener("close", (event) => {
  console.log("Conexión cerrada");
});
