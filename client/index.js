const WebSocket = require("ws");

const socket = new WebSocket('ws://localhost:3333');

socket.addEventListener('open', (event) => {
  console.log('Conexión establecida con el servidor');

  // Ahora que la conexión está abierta, puedes enviar mensajes
  socket.send('Hola servidor, soy un nuevo jugador');
});

socket.addEventListener('message', (event) => {
  console.log(`Mensaje del servidor: ${event.data}`);
});

// NOTA: No deberías enviar mensajes fuera del evento 'open' para evitar el error
// de enviar mensajes antes de que la conexión esté completamente abierta.
