import type { ServerCommandResponse, Location, Objective } from '../types'
import type { Connection } from '../connection'

export class Player {
  protected readonly connection: Connection
  protected readonly name: string

  public constructor(connection: Connection, name: string) {
    this.connection = connection
    this.name = name
  }

  public getName(): string {
    return this.name
  }

  public executeCommand(command: string, callback?: (data: ServerCommandResponse) => void): void {
    this.connection.executeCommand(`execute "${this.name}" ~ ~ ~ ${command}`, (data) => {
      if (!callback) return
      callback(data)
    })
  }

  public async getScore(objective: Objective): Promise<number> {
    return new Promise((result) => {
      this.connection.executeCommand(`scoreboard players test "${this.name}" "${objective.id}" * *`, (res) => {
        if (res.err) return result(0)

        return result(parseInt(String(res.statusMessage?.split(' ')[1] ?? 0), 10))
      })
    })
  }

  public async setScore(objective: Objective, amount: number): Promise<number> {
    this.executeCommand(`scoreboard players set @s "${objective.id}" ${amount}`)

    return await (this.getScore(objective))
  }

  public async addScore(objective: Objective, amount: number): Promise<number> {
    this.executeCommand(`scoreboard players add @s "${objective.id}" ${amount}`)

    return await (this.getScore(objective))
  }

  public async removeScore(objective: Objective, amount: number): Promise<number> {
    this.executeCommand(`scoreboard players remove @s "${objective.id}" ${amount}`)

    return await (this.getScore(objective))
  }

  public sendMessage(message: string): void {
    this.executeCommand(`tellraw @s {"rawtext":[{"text":"${message.replace(/"/g, '\\"')}"}]}`)
  }

  public sendActionbar(message: string): void {
    this.executeCommand(`titleraw @s actionbar {"rawtext":[{"text":"${message.replace(/"/g, '\\"')}"}]}`)
  }

  public sendTitle(message: string): void {
    this.executeCommand(`titleraw @s title {"rawtext":[{"text":"${message.replace(/"/g, '\\"')}"}]}`)
  }

  public sendSubtitle(message: string): void {
    this.executeCommand(`titleraw @s subtitle {"rawtext":[{"text":"${message.replace(/"/g, '\\"')}"}]}`)
  }

  public sendSound(sound: string, location?: Location, volume?: number, pitch?: number, maxVolume?: number): void {
    this.executeCommand(
      `playsound ${sound} ${location?.x ?? ''} ${location?.y ?? ''} ${location?.z ?? ''} ${volume ?? ''} ${
        pitch ?? ''
      } ${maxVolume ?? ''}`,
    )
  }

  public sendAnimation(animation: string): void {
    this.executeCommand(`playanimation @s ${animation}`)
  }

  public sendFog(type: 'pop' | 'push' | 'remove', fogId: string, globalId: string): void {
    this.executeCommand(`fog @s ${type} ${fogId} ${globalId}`)
  }

  public async hasTag(tag: string): Promise<boolean> {
    return new Promise(async (res) => {
      const tags = await this.getTags()
      if (tags.includes(tag)) return res(true)

      return res(false)
    })
  }

  public async getTags(): Promise<string[]> {
    return new Promise((res) => {
      this.connection.executeCommand(`tag "${this.name}" list`, (data) => {
        if (data.err) return res([])
        if (data.statusMessage.includes('has no tags')) return res([])
        const tags = (((data.statusMessage.match(/§a([^']+)§r/) as any) as string[])[0].split(', ').map((x) => x.slice(0, x.length - 2).substring(2)))

        return res(tags)
      })   
    })
  }
}