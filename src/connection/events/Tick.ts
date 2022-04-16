import type { Connection } from '../index'

export class TickEvent {
  protected readonly _connection: Connection
  protected interval: NodeJS.Timer
  public ticks = 0
  public readonly name = 'TickEvent'

  public constructor(connection: Connection) {
    this._connection = connection
    this._connection.once('Closed', this.clear.bind(this))
    this.handler()
  }

  private clear(): void {
    clearInterval(this.interval)
  }

  private handler(): void {
    this.interval = setInterval(() => {
      this.ticks++
      this._connection.emit('Tick', {
        currentTick: this.ticks,
      })
    }, 50)
  }
}
