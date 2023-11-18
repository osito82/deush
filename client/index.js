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
      case "su":
      case "1":
        sendCommand(mockTest["signUp"]);
        break;

      case "dealtPrivateCards":
      case "dp":
      case "2":
        sendCommand(mockTest["dealtPrivateCards"]);
        break;

      case "initialBet":
      case "ib":
      case "3":
        sendCommand(mockTest["initialBet"]);
        break;
      case "startGame":
      case "sg":
      case "4":
        sendCommand(mockTest["startGame"]);
        break;

      case "ac":
      case "askCard":
        sendCommand(mockTest["askCard"]);
        break;
      case "close":
        console.log("Cerrando conexión.");
        socket.close();
        rl.close(); // Cerrar la interfaz de línea de comandos
        break;

      //DEVELOPMENT COMMANDS
      case "log":
      case "lg":
      case "LOG":
        sendCommand(mockTest["log"]);
        break;

      case "sm":
      case "sendMessage":
      case "10":
        let playerId;
        let msg;
        rl.question(" - Ingrese el id del Jugador: ", (playerIdAnswer) => {
          playerId = playerIdAnswer;
          rl.question(
            ` - Ingrese el mensaje para ${playerId}: `,
            (msgAnswer) => {
              msg = msgAnswer;

              mockTest.sendMessage.targetPlayerId = playerId;
              mockTest.sendMessage.targetMessage = msg;
              //  console.log(mockTest.sendMessage, 'xxx')
              // Ahora puedes enviar el mensaje con los datos ingresados por el usuario
              sendCommand(mockTest["sendMessage"]);
              promptCommand();
            }
          );
        });
        break;

      default:
        console.log("Comando no reconocido");
    }
  };

  // Función para solicitar un comando y manejarlo
  const promptCommand = () => {
    const askCommand = () => {
      rl.question("Ingrese un comando: ", (command) => {
        handleCommand(command);

        if (
          command.toLowerCase() !== "cerrar" &&
          command.toLowerCase() !== "close"
        ) {
          askCommand();
        } else {
          rl.close();
        }
      });
    };

    askCommand();
  };

  promptCommand();

  //   const promptCommand = () => {
  //     rl.question("Ingrese un comando: ", (command) => {
  //       handleCommand(command);
  //       if (command !== "cerrar" && command !== "close") {
  //         promptCommand();
  //       }
  //     });
  //   };

  //   promptCommand();
});

socket.addEventListener("message", (event) => {
  console.log(`Mensaje del servidor: ${event.data}`);
});

socket.addEventListener("close", (event) => {
  console.log("Conexión cerrada");
});
