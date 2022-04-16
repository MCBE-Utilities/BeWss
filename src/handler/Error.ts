import type { Client } from '../index'

export class ErrorHandler {
  protected readonly _client: Client
  public readonly name = 'ErrorHandler'

  public constructor(client: Client) {
    this._client = client
    this._client.server.on('error', this.handler.bind(this))
  }

  private handler(error: Error): void {
    this._client.emit('Error', error)
  }
}
