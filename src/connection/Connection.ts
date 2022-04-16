import type { Client } from '../index'
import type { WebSocket } from 'ws'
import type { PacketResponse, ServerCommandResponse, ConnectionEvents } from '../types'
import { EventEmitter } from 'events'
import { genUuid } from '../utils'
import { handlers } from './handler'
import { events } from './events'
import { Packet } from '../packet'
import { Player, PlayerManager } from '../player'
import { ScoreboardManager } from '../scoreboard'
import { WorldManager } from '../world'

export interface Connection {
  on<K extends keyof ConnectionEvents>(event: K, callback: (...args: ConnectionEvents[K]) => void): this
  on<S extends string | symbol>(
    event: Exclude<S, keyof ConnectionEvents>,
    callback: (...args: unknown[]) => void,
  ): this
  once<K extends keyof ConnectionEvents>(event: K, callback: (...args: ConnectionEvents[K]) => void): this
  once<S extends string | symbol>(
    event: Exclude<S, keyof ConnectionEvents>,
    callback: (...args: unknown[]) => void,
  ): this
  emit<K extends keyof ConnectionEvents>(event: K, ...args: ConnectionEvents[K]): boolean
  emit<S extends string | symbol>(
    event: Exclude<S, keyof ConnectionEvents>,
    ...args: unknown[]
  ): boolean
}

export class Connection extends EventEmitter {
  protected readonly handlers = new Map<string, any>()
  protected host: string
  public isPaused = false
  public readonly events = new Map<string, any>()
  public readonly pendingPackets = new Map<string, { callback?: (data: PacketResponse) => void, packet: Packet }>()
  public readonly uniqueId: string
  public readonly client: Client
  public readonly socket: WebSocket
  public readonly players: PlayerManager
  public readonly scoreboards: ScoreboardManager
  public readonly world: WorldManager

  public constructor(client: Client, socket: WebSocket) {
    super()
    this.uniqueId = genUuid()
    this.client = client
    this.socket = socket
    this.players = new PlayerManager(this)
    this.scoreboards = new ScoreboardManager(this)
    this.world = new WorldManager(this)
    this.loadHandlers()
    this.loadEvents()
    this.sendPacket(new Packet('commandRequest', 'getlocalplayername'), (res) => {
      this.host = (res.raw.body as any).localplayername as string
    })
  }

  private loadHandlers(): void {
    for (const handler of handlers) {
      const registered = new handler(this)
      this.handlers.set(registered.name, registered)
    }
  }
  
  private loadEvents(): void {
    for (const event of events) {
      const registered = new event(this)
      this.events.set(registered.name, registered)
    }
  }

  public terminate(): void {
    this.socket.terminate()
  }

  public sendPacket(packet: Packet, callback?: (data: PacketResponse) => void): void {
    this.pendingPackets.set(packet.id, {
      callback: callback ?? undefined,
      packet,
    })
    this.socket.send(packet.compress())
  }

  public executeCommand(command: string, callback?: (data: ServerCommandResponse) => void): void {
    this.sendPacket(new Packet('commandRequest', command), (data) => {
      if (!callback) return

      if (data.raw.body.statusCode < 0) {
        return callback({
          err: true,
          statusMessage: data.raw.body.statusMessage,
          data: data.raw.body,
        })
      } else {
        return callback({
          err: false,
          statusMessage: data.raw.body.statusMessage,
          data: data.raw.body,
        })
      }
    })
  }

  public getHost(): Player {
    return this.players.getByName(this.host)
  }
}
