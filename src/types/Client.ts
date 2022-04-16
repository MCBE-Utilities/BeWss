import type { Connection } from '../connection'
import type { Player } from '../player'

export interface ClientEvents {
  Listening: []
  Closed: []
  Error: [Error]
  Connection: [Connection]
  OnJoin: [ClientOnJoinEvent]
  OnLeave: [ClientOnLeaveEvent]
  OnChat: [ClientOnChatEvent]
}

export interface ClientOnJoinEvent {
  player: Player
  connection: Connection
}

export interface ClientOnLeaveEvent {
  player: Player
  connection: Connection
}

export interface ClientOnChatEvent {
  sender: Player
  message: string
  type: 'chat' | 'tell'
  connection: Connection
}
