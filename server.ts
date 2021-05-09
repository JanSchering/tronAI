import * as express from "express";
import * as http from "http";
import { AddressInfo } from "node:net";
import * as WebSocket from "ws";
import * as path from "path";
import { RegisteredClient, ExtWebSocket, Invite } from "./serverside/types";
import { toEvent } from "./serverside/utils";
import { handleLobby } from "./serverside/lobby";
import { handleInvite } from "./serverside/onlinesetup";
import { Registry } from "./serverside/registry";

const app = express();
/*
 * Keep track of players that are currently in online mode.
 * TODO: Only those that are not engaged in a match.
 * TODO: Should also show players from offline mode probably.
 */
let registry = new Registry();
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
    ws.isAlive = true;
  });

  ws.on("message", (message: string) => toEvent(message, ws));

  ws.on("register", (name: string) => {
    if (!registry.hasClient(ws)) {
      registry.add({ name, socket: ws });
    }
  });

  const inviteHandler = handleInvite.bind({ registry });
  ws.on("invite", inviteHandler);

  ws.on("accept", (payload: object) => {
    const { recipient, sender } = payload as Invite;
    const players: RegisteredClient[] = [];
    registry.clients.forEach((client) => {
      if (client.name === recipient || client.name === sender) {
        client.socket.off("invite", inviteHandler);
        players.push(client);
      }
    });
    handleLobby(players, idCount.toString());
  });

  ws.on("list", () => {
    const names = registry.clientNames;
    console.log(names);
    ws.send(JSON.stringify({ type: "list", names }));
  });

  ws.on("close", () => registry.removeBySocket(ws));

  setInterval(() => {
    wss.clients.forEach((ws: ExtWebSocket) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(null, false, (err) => {});
    });
  }, 10000);
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${(<AddressInfo>server.address()).port} :)`
  );
});
