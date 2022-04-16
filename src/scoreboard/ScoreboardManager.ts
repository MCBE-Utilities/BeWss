import type { Connection } from '../connection'
import type { Objective, ScoreboardSlot } from '../types'

export class ScoreboardManager {
  protected readonly connection: Connection

  public constructor(connection: Connection) {
    this.connection = connection
  }

  public async createObjective(objective: Objective): Promise<boolean> {
    return new Promise(async (res) => {
      if ((await (this.getObjectives())).find((x) => x.id === objective.id)) return res(false)
      this.connection.executeCommand(
        `scoreboard objectives add ${objective.id} ${objective?.type ?? 'dummy'} "${objective?.display ?? objective.id}"`,
      (data) => {
        if (data.err) {
          console.log(data.statusMessage)

          return res(false)
        }

        return res(true)
      })
    })
  }

  public async removeObjective(id: string): Promise<boolean> {
    return new Promise(async (res) => {
      if (!(await (this.getObjectives())).find((x) => x.id === id)) return res(false)
      this.connection.executeCommand(`scoreboard objectives remove ${id}`, (data) => {
        if (data.err) {
          console.log(data.statusMessage)

          return res(false)
        }

        return res(true)
      })
    })
  }

  public async getObjectives(): Promise<Objective[]> {
    return new Promise((res) => {
      const objectives: Objective[] = []
      this.connection.executeCommand('scoreboard objectives list', (data) => {
        if (data.err) return res(objectives)
        const split = data.statusMessage.split('\n')
        for (const line of split) {
          if (!line.startsWith('-')) continue
          const objective = line.split(' ')[1].slice(0, line.split(' ')[1].length - 1)
          const display = ((line.match(/'([^']+)'/) as any)[0] as string).replace(/'/g, '')
          const type = ((line.match(/type '([^']+)'/) as any)[0] as string).replace(/'/g, '').replace('type ', '')
          objectives.push({
            id: objective,
            display,
            type,
          })
        }

        return res(objectives)
      })
    })
  }

  public setDisplay(objective: Objective, slot: ScoreboardSlot): void {
    this.connection.executeCommand(`scoreboard objectives setdisplay ${slot} ${objective.id}`, (data) => {
      if (!data.err) return

      console.log(data.statusMessage)
    })
  }
}