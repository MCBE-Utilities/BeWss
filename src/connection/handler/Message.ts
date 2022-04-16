import type { Connection } from '../index'
import type { RawData } from 'ws'
import type {RawPacketResponse } from '../../types'

export class MessageHandler {
  protected readonly _connection: Connection
  public readonly name = 'MessageHandler'

  public constructor(connection: Connection) {
    this._connection = connection
    this._connection.socket.on('message', this.handler.bind(this))
  }

  private handler(data: RawData, isBinary: boolean): void {
    try {
      // TODO: Emit globaly & handle if binary
      const packet = JSON.parse(data.toString('utf-8')) as RawPacketResponse
      if (packet.header.messagePurpose === 'event') {
        const valid = Array.from(this._connection.events.values()).find((x) => x.eventName === packet.body.eventName)
        if (!valid) return
        valid.handler(packet)
      } else {
        if (!this._connection.pendingPackets.has(packet.header.requestId)) return
        const pending = this._connection.pendingPackets.get(packet.header.requestId)
        if (pending.callback) {
          pending.callback({
            raw: packet,
            packet: pending.packet,
          })
        }
      }
      this._connection.pendingPackets.delete(packet.header.requestId)
    } catch (err) {
      console.log(`Failed to parse inbound packet: ${err}`)
    }
    this._connection.emit('Message', {
      data,
      isBinary,
    })
  }
}
