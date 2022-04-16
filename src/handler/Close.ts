import type { Client } from '../index'
import type { WebSocket } from 'ws'

export class CloseHandler {
  protected readonly _client: Client
  public readonly name = 'CloseHandler'

  public constructor(client: Client) {
    this._client = client
    this._client.server.on('close', this.handler.bind(this))
  }

  private handler(): void {
    this._client.emit('Closed')
  }
}
