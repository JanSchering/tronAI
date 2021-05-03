import { ExtWebSocket, Invite, RegisteredClient } from "./types";

/**
 * @description Find the index of the first matching RegisteredClient.
 * @param registry - List of registered clients.
 * @param client - a WebSocket client object.
 * @returns the index of the found client
 */
export const findIndexByClient = (
  registry: RegisteredClient[],
  client: ExtWebSocket
): number => {
  return registry.findIndex((regObj) => regObj.client === client);
};

/**
 * @description Find the first matching RegisteredClient by name.
 * @param registry
 * @param name
 * @returns The first matching registered client
 */
export const findByName = (
  registry: RegisteredClient[],
  name: string
): RegisteredClient => {
  return registry.find((regObj) => regObj.name === name);
};
