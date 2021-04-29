import * as express from "express";
import * as http from "http";
import { AddressInfo } from "node:net";
import * as WebSocket from "ws";

const app = express();

app.get("/home", () => {
  console.log("test");
});

app.listen(10000, () => {
  console.log("client listens");
});

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: ExtWebSocket) => {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.send(`received a pong!`);
    ws.isAlive = true;
  });

  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);

    const broadcastRegex = /^broadcast\:/;

    if (broadcastRegex.test(message)) {
      message = message.replace(broadcastRegex, "");

      //send back the message to the other clients
      wss.clients.forEach((client) => {
        if (client != ws) {
          client.send(`Hello, broadcast message -> ${message}`);
        }
      });
    } else {
      ws.send(`Hello, you sent -> ${message}`);
    }
  });

  setInterval(() => {
    wss.clients.forEach((ws: ExtWebSocket) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping(null, false, (err) => {});
    });
  }, 10000);

  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${(<AddressInfo>server.address()).port} :)`
  );
});

export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}
