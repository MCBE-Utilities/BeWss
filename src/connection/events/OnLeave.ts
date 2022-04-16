import type { Connection } from '../index'

export class OnLeave {
  protected readonly _connection: Connection
  protected oldPlayers = []
  public readonly name = 'OnLeave'
  public readonly eventName = 'custom'

  public constructor(connection: Connection) {
    this._connection = connection
    this._connection.on('Tick', this.handler.bind(this))
  }

  private handler(): void {
    if (this._connection.isPaused) return
    this._connection.executeCommand('list', (res) => {
      if (res.err) return
      const players = ((res.data as any).players as string).split(', ')
      for (const player of this.oldPlayers) {
        if (players.includes(player)) continue
        const playerObject = this._connection.players.getByName(player)
        this._connection.emit('OnLeave', playerObject)
        this._connection.client.emit('OnLeave', {
          player: playerObject,
          connection: this._connection,
        })
        this._connection.players.remove(playerObject)
      }
      this.oldPlayers = players
    })
  }
}
