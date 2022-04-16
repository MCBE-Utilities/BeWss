import type { RawPacketResponse } from './'
import type { Packet } from '../packet'

export interface PacketResponse {
  raw: RawPacketResponse
  packet: Packet
}
