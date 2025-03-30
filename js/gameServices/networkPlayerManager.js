import { NetworkPlayer } from "../entities/networkPlayer.js"
import networkService from "./networkService.js"
import playerDataService from "./playerDataService.js"
import { Player } from "../entities/player.js"

export class NetworkPlayerManager {
  constructor(scene) {
    this.scene = scene
    this.players = new Map()
    this.localPlayerId = playerDataService.data.id

    this.setupNetworkListeners()
    this.loadExistingPlayers()
  }

  loadExistingPlayers() {

    networkService.initialPlayers.forEach(player =>{
      // Server handles filtering out local player
      const newPlayer = new NetworkPlayer(this.scene, player.id, player.position.x, player.position.y, player.position.direction, player.name)
    })

  }

  setupNetworkListeners() {

    networkService.events.on('playerJoined', (playerData) =>{
      console.log("EVENT RECEIVED")
      this.handlePlayerJoined(playerData)
    })

    networkService.events.on('playerMoved', (position) =>{
      this.handlePlayerMove(position)
    })

    networkService.events.on('playerLeft', (playerId) =>{
      this.handlePlayerLeft(playerId)
    })

  }

  handlePlayerJoined(playerData) {

    if (playerData.id === this.localPlayerId){
      return
    }

    console.log(`Player Joined!: `, playerData.position)

    if(!this.players.has(playerData.id)){
      const player = new NetworkPlayer(
        this.scene,
        playerData.id,
        playerData.position.x,
        playerData.position.y,
        playerData.position.direction,
        playerData.name
      )

      this.players.set(playerData.id, player)
    }

  }

  handlePlayerMove(position) {

    if(position.id === this.localPlayerId){
      return
    }

    const player = this.players.get(position.id)
    if(player){
      player.updatePosition(position.x, position.y, position.direction)
      player.playAnimation()
    } else {
        const player = new NetworkPlayer(
            this.scene,
            position.id,
            position.x,
            position.y,
            position.direction,
            position.id
        )
      
        this.players.set(position.id, player)
    }
  
  }

  handlePlayerLeft(playerId) {

    if(this.players.has(playerId)) {
      console.log(`Player Left: ${playerId}`)
      const player = this.players.get(playerId)
      player.destroy()
      this.players.delete(playerId)
    }

  }

  update() {

  }
}