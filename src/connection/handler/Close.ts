import type { Connection } from '../index'

export class CloseHandler {
  protected readonly _connection: Connection
  public readonly name = 'CloseHandler'

  public constructor(connection: Connection) {
    this._connection = connection
    this._connection.socket.on('close', this.handler.bind(this))
  }

  private handler(code: number, reason: Buffer): void {
    this._connection.client.connections.delete(this._connection.uniqueId)
    this._connection.emit('Closed', {
      code,
      reason,
    })
  }
}
