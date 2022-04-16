import type { Player } from '../player'
import type { Screens } from './'

export interface ConnectionEvents {
  Closed: [ConnectionClosedEvernt]
  Error: [ConnectionErrorEvent]
  Message: [ConnectionMessageEvent]
  Tick: [TickEvent]
  OnJoin: [Player]
  OnLeave: [Player]
  OnChat: [OnChatEvent]
  ScreenChanged: [ScreenChangedEvent]
}

export interface ConnectionClosedEvernt {
  code: number
  reason: Buffer
}

export interface ConnectionErrorEvent {
  error: Error
}

export interface ConnectionMessageEvent {
  data: Buffer | ArrayBuffer | Buffer[]
  isBinary: boolean
}

export interface TickEvent {
  currentTick: number
}

export interface OnChatEvent {
  sender: Player
  message: string
  type: string
}

export interface ScreenChangedEvent {
  player: Player
  screen: Screens
  previous: Screens
}
