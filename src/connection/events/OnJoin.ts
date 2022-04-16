import type { Connection } from '../index'

export class OnJoin {
  protected readonly _connection: Connection
  protected oldPlayers = []
  public readonly name = 'OnJoin'
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
      for (const player of players) {
        if (this.oldPlayers.includes(player)) continue
        const playerObject = this._connection.players.create(player)
        this._connection.players.add(playerObject)
        this._connection.emit('OnJoin', playerObject)
        this._connection.client.emit('OnJoin', {
          player: playerObject,
          connection: this._connection,
        })
      }
      this.oldPlayers = players
    })
  }
}
