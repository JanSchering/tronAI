import { ExtWebSocket, RegisteredClient } from "./types";

export class Registry {
  private _clients: RegisteredClient[];

  constructor() {
    this._clients = [];
  }

  public get clients(): RegisteredClient[] {
    return this._clients;
  }

  /**
   * @description Provide the name of every client.
   */
  public get clientNames(): string[] {
    return this._clients.map((client) => client.name);
  }

  /**
   * @description Find the index of the first matching RegisteredClient.
   * @returns the index of the found socket.
   */
  private findIndexBySocket(socket: ExtWebSocket): number {
    return this._clients.findIndex((regObj) => regObj.socket === socket);
  }

  /**
   * @description Find the first matching RegisteredClient by name.
   * @returns The first matching registered client
   */
  public findClientByName(name: string): RegisteredClient {
    return this._clients.find((regObj) => regObj.name === name);
  }

  /**
   * @description Add new client to registry.
   */
  public add(client: RegisteredClient): void {
    this._clients.push(client);
  }

  public hasClient(ws: ExtWebSocket): boolean {
    const idx = this.findIndexBySocket(ws);
    return idx !== -1;
  }

  public removeBySocket(ws: ExtWebSocket): void {
    const regIdx = this.findIndexBySocket(ws);
    this._clients = this._clients.splice(regIdx, 1);
  }
}
