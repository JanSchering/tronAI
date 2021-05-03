import * as WebSocket from "ws";

export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

export type RegisteredClient = {
  name: string;
  client: ExtWebSocket;
};

export type Invite = {
  sender: string;
  recipient: string;
};
