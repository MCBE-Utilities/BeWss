import type { Connection } from '../index'
import type { RawPacketResponse } from '../../types'
import { Packet } from '../../packet'

export class OnChat {
  protected readonly _connection: Connection
  protected oldPlayers = []
  public readonly name = 'OnChat'
  public readonly eventName = 'PlayerMessage'

  public constructor(connection: Connection) {
    this._connection = connection
    const packet = new Packet('subscribe', this.eventName)
    this._connection.sendPacket(packet)
  }

  public handler(data: RawPacketResponse): void {
    const properties = (data.body as any).properties
    const player = this._connection.players.getByName(properties.Sender)
    if (!player) return
    const message = properties.Message
    const type = properties.MessageType
    this._connection.emit('OnChat', {
      sender: player,
      message,
      type,
    })
    this._connection.client.emit('OnChat', {
      sender: player,
      message,
      type,
      connection: this._connection,
    })
  }
}
