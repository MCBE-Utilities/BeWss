import type { Connection } from '../index'

export class ErrorHandler {
  protected readonly _connection: Connection
  public readonly name = 'ErrorHandler'

  public constructor(connection: Connection) {
    this._connection = connection
    this._connection.socket.on('error', this.handler.bind(this))
  }

  private handler(error: Error): void {
    // TODO: Handle
    console.log(`Connection open with id ${this._connection.uniqueId} errored: ${error.message}`)
    this._connection.emit('Error', {
      error,
    })
  }
}
