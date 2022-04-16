import type { Connection } from '../connection'
import { Player } from './'

export class PlayerManager {
  protected readonly players = new Map<string, Player>()
  protected readonly connection: Connection

  public constructor(Connection: Connection) {
    this.connection = Connection
  }

  public add(player: Player): void {
    this.players.set(player.getName(), player)
  }

  public create(name: string): Player {
    return new Player(this.connection, name)
  }

  public remove(player: Player) {
    this.players.delete(player.getName())
  }

  public removeByName(playerName: string) {
    this.players.delete(playerName)
  }

  public getAll(): Map<string, Player> {
    return this.players
  }

  public getAllAsArray(): Player[] {
    return Array.from(this.getAll().values())
  }

  public getByName(playerName: string): Player | undefined {
    return this.players.get(playerName)
  }
}
