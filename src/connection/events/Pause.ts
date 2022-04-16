import type { Connection } from '../index'
import type { ScreenChangedEvent } from '../../types'

export class Pause {
  protected readonly _connection: Connection
  protected oldPlayers = []
  public readonly name = 'Pause'
  public readonly eventName = 'custom'

  public constructor(connection: Connection) {
    this._connection = connection
    this._connection.on('ScreenChanged', this.handler.bind(this))
  }

  private handler(data: ScreenChangedEvent): void {
    if (data.screen === 'modal_progress_screen - begin_leaving_world') {
      this._connection.isPaused = true
    } else if (data.screen === 'in_game_play_screen') {
      this._connection.isPaused = false
    }
  }
}
