import type { Client } from '../index'
import type { WebSocket } from 'ws'
import { Connection } from '../connection'

export class ConnectionHandler {
  protected readonly _client: Client
  public readonly name = 'ConnectionHandler'

  public constructor(client: Client) {
    this._client = client
    this._client.server.on('connection', this.handler.bind(this))
  }

  private handler(data: WebSocket): void {
    const connection = new Connection(this._client, data)
    this._client.connections.set(connection.uniqueId, connection)
    this._client.emit('Connection', connection)
  }
}
