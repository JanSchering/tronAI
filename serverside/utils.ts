import { ExtWebSocket, Invite, RegisteredClient } from "./types";

/**
 * @description Create and dispatch events from received messages.
 * @param message - The message from the client.
 * @param client - The client to dispatch to.
 */
export const toEvent = (message: string, client: ExtWebSocket) => {
  try {
    console.log(message);
    var event = JSON.parse(message);
    console.log(event.type);
    client.emit(event.type, event.payload);
  } catch (err) {
    console.log("not an event", err);
  }
};
