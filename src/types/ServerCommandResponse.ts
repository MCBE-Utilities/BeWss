import type { PacketBody } from './'

export interface ServerCommandResponse {
  statusMessage: string
  data: PacketBody | undefined
  err: boolean
}
