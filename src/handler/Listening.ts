import type { Client } from '../index'

export class ListeningHandler {
  protected readonly _client: Client
  public readonly name = 'ListeningHandler'

  public constructor(client: Client) {
    this._client = client
    this._client.server.on('listening', this.handler.bind(this))
  }

  private handler(): void {
    this._client.emit('Listening')
  }
}
