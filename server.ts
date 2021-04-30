import * as express from "express";
import * as http from "http";
import { AddressInfo } from "node:net";
import * as WebSocket from "ws";

const app = express();
const registry: RegisteredClient[] = [];

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

  ws.on("message", (message: string) => toEvent(message, ws));

  ws.on("register", (name: string) => {
    registry.push({ name, client: ws });
  });

  ws.on("list", () => {
    const names = registry.map((regObj) => regObj.name);
    console.log(names);
    ws.send(JSON.stringify({ type: "list", names }));
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

const toEvent = (message: string, client: ExtWebSocket) => {
  try {
    var event = JSON.parse(message);
    console.log(event.type);
    client.emit(event.type, event.payload);
  } catch (err) {
    console.log("not an event", err);
  }
};

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

type RegisteredClient = {
  name: string;
  client: ExtWebSocket;
};
