import type { Connection } from '../index'
import type { RawPacketResponse } from '../../types'
import { Packet } from '../../packet'

export class ScreenChanged {
  protected readonly _connection: Connection
  protected oldPlayers = []
  public readonly name = 'ScreenChanged'
  public readonly eventName = 'ScreenChanged'

  public constructor(connection: Connection) {
    this._connection = connection
    const packet = new Packet('subscribe', this.eventName)
    this._connection.sendPacket(packet)
  }

  public handler(data: RawPacketResponse): void {
    const properties = (data.body as any).properties
    this._connection.emit('ScreenChanged', {
      player: this._connection.getHost(),
      screen: properties.ScreenName,
      previous: properties.PreviousScreenName,
    })
  }
}
