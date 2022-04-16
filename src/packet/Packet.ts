import { genUuid } from '../utils'

export class Packet {
  public id = genUuid()
  public packet: 'commandRequest' | 'subscribe' | 'unsubscribe'
  public data: string

  public constructor(packet: 'commandRequest' | 'subscribe' | 'unsubscribe', data: string) {
    this.packet = packet
    this.data = data
  }

  public compress(): string {
    if (this.packet === 'subscribe' || this.packet === 'unsubscribe') {
      return JSON.stringify({
        body: {
          eventName: this.data,
          version: 1,
        },
        header: {
          requestId: this.id,
          messagePurpose: this.packet,
          version: 1,
        },
      })
    } else {
      return JSON.stringify({
        body: {
          commandLine: this.data,
          version: 1,
        },
        header: {
          requestId: this.id,
          messagePurpose: this.packet,
          version: 1,
        },
      })
    }
  }
}