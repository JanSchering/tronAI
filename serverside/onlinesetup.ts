import { Registry } from "./registry";
import { Invite, RegisteredClient } from "./types";

/**
 * @description Relays a invitation from the sender to the recipient.
 */
export const handleInvite = (payload: object) => {
  const { recipient, sender } = payload as Invite;
  let registry: Registry;
  try {
    registry = (<any>this).registry;
  } catch (err) {
    throw new Error("No registry bound to the invite Handler");
  }
  const { socket } = registry.findClientByName(recipient);
  socket.send(JSON.stringify({ type: "invite", sender }));
};
