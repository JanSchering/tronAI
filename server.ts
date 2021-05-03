import * as express from "express";
import * as http from "http";
import { AddressInfo } from "node:net";
import * as WebSocket from "ws";
import * as path from "path";
import { RegisteredClient, ExtWebSocket, Invite } from "./serverside/types";
import { findIndexByClient, findByName } from "./serverside/utils";

const app = express();
/*
 * Keep track of players that are currently in online mode.
 * TODO: Only those that are not engaged in a match.
 * TODO: Should also show players from offline mode probably.
 */
let registry: RegisteredClient[] = [];
/*
 * Collect Connected Pairs of Players in a Python-Dictionary Style.
 */
let connections: any = {};
/*
 * Helper for the connections, is used to index the connections object.
 */
let idCount = 0;

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "/index.html"));
});

app.use(express.static("dist"));

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
    //ws.send(`received a pong!`);
    ws.isAlive = true;
  });

  ws.on("message", (message: string) => toEvent(message, ws));

  ws.on("register", (name: string) => {
    const idx = findIndexByClient(registry, ws);
    console.log("index found:", idx);
    if (idx === -1) registry.push({ name, client: ws });
  });

  ws.on("invite", (payload: object) => {
    const { recipient, sender } = payload as Invite;
    const { client } = findByName(registry, recipient);
    client.send(JSON.stringify({ type: "invite", sender }));
  });

  ws.on("accept", (payload: object) => {
    const { recipient, sender } = payload as Invite;
    const players: RegisteredClient[] = [];
    registry.forEach((regObj) => {
      if (regObj.name === recipient || regObj.name === sender) {
        players.push(regObj);
        regObj.client.send(
          JSON.stringify({
            type: "connect",
            payload: {
              players: [recipient, sender],
              id: idCount,
            },
          })
        );
      }
    });
    connections[idCount] = players;
    const interv = setInterval(() => {
      players.forEach((player) => {
        if (!player.client.isAlive) {
          players.forEach((member) => {
            if (member.client !== player.client) {
              member.client.send("connectionLost");
            }
          });
          delete connections[idCount];
          clearInterval(interv);
        }
      });
    }, 5000);
  });

  ws.on("list", () => {
    const names = registry.map((regObj) => regObj.name);
    console.log(names);
    ws.send(JSON.stringify({ type: "list", names }));
  });

  ws.on("close", () => {
    const regIdx = findIndexByClient(registry, ws);
    registry = registry.splice(regIdx, 1);
  });

  setInterval(() => {
    wss.clients.forEach((ws: ExtWebSocket) => {
      if (!ws.isAlive) {
        // TODO: remove from registry
        const regIdx = findIndexByClient(registry, ws);
        registry = registry.splice(regIdx, 1);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(null, false, (err) => {});
    });
  }, 10000);

  //send immediatly a feedback to the incoming connection
  ws.send(
    JSON.stringify({
      type: "misc",
      message: "Hi there, I am a WebSocket server",
    })
  );
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${(<AddressInfo>server.address()).port} :)`
  );
});

const toEvent = (message: string, client: ExtWebSocket) => {
  try {
    console.log(message);
    var event = JSON.parse(message);
    console.log(event.type);
    client.emit(event.type, event.payload);
  } catch (err) {
    console.log("not an event", err);
  }
};
