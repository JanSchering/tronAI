import { RegisteredClient } from "./types";

export const handleLobby = (participants: RegisteredClient[], id: string) => {
  const names = participants.map((participant) => participant.name);
  let readyCount = 0;
  participants.forEach((participant) => {
    /*
     * Broadcast a Connection message to all participants.
     */
    participant.socket.send(
      JSON.stringify({
        type: "connect",
        payload: {
          players: names,
          id,
        },
      })
    );

    /*
     * Listen to ready-messages from the participants. When
     * All participants are ready, the game start can be initiated.
     */
    participant.socket.on("ready", (payload: object) => {
      if (readyCount == participants.length) {
        // TODO: Send message to notify clients and have them setup the board etc.
      }
    });
  });

  /*
   * To ensure that a player doesnt get stuck in a lobby
   * from the other participants losing connection, check all 5 seconds
   * if each client is still responsive. If not, broadcast the loss of connection
   */
  const interv = setInterval(() => {
    participants.forEach((participant) => {
      if (!participant.socket.isAlive) {
        participants.forEach((other) => {
          if (other.socket !== participant.socket) {
            other.socket.send("connectionLost");
          }
        });
        clearInterval(interv);
      }
    });
  }, 5000);
};
