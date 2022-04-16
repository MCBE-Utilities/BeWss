import { Server } from 'ws'
import { handlers } from './handler'
import { EventEmitter } from 'events'
import { Connection } from './connection'
import type { ClientEvents } from './types'

export interface Client {
  on<K extends keyof ClientEvents>(event: K, callback: (...args: ClientEvents[K]) => void): this
  on<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    callback: (...args: unknown[]) => void,
  ): this
  once<K extends keyof ClientEvents>(event: K, callback: (...args: ClientEvents[K]) => void): this
  once<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    callback: (...args: unknown[]) => void,
  ): this
  emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean
  emit<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    ...args: unknown[]
  ): boolean
}

export class Client extends EventEmitter {
  protected readonly handlers = new Map<string, any>()
  public readonly connections = new Map<string, Connection>()
  public readonly port: number
  public readonly server: Server

  public constructor(port: number) {
    super()
    this.port = port
    this.server = new Server({
      port: this.port,
    })
    this.loadHandlers()
  }

  private loadHandlers(): void {
    for (const handler of handlers) {
      const registered = new handler(this)
      this.handlers.set(registered.name, registered)
    }
  }
}

export const client = new Client(8080)
