import type { Packets } from './'

export interface RawPacketResponse {
  body: PacketBody
  header: PacketHeader
}

export interface PacketBody {
  eventName?: string
  statusMessage?: string
  statusCode?: number
}

export interface PacketHeader {
  messagePurpose: Packets
  requestId: string
  version: number
}
