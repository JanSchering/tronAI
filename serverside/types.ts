import * as WebSocket from "ws";

export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

export type RegisteredClient = {
  name: string;
  socket: ExtWebSocket;
};

export type Invite = {
  sender: string;
  recipient: string;
};
