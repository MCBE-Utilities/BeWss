import type { Connection } from '../connection'

export class WorldManager {
  protected readonly connection: Connection

  public constructor(connection: Connection) {
    this.connection = connection
  }

  public sendMessage(message: string): void {
    this.connection.executeCommand(`tellraw @a {"rawtext":[{"text":"${message.replace(/"/g, '\\"')}"}]}`)
  }

  public sendActionbar(message: string): void {
    this.connection.executeCommand(`titleraw @a actionbar {"rawtext":[{"text":"${message.replace(/"/g, '\\"')}"}]}`)
  }
}
