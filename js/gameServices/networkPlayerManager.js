import { NetworkPlayer } from "../entities/networkPlayer.js"
import networkService from "./networkService.js"
import playerDataService from "./playerDataService.js"

export class NetworkPlayerManager {
  constructor(scene) {
    this.scene = scene
    this.players = new Map()
    this.localPlayerId = playerDataService.data.id

    this.setupNetworkListeners()
  }

  setupNetworkListeners() {

    networkService.events.on('playerJoined', (playerData) =>{
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
        playerData.position.direction
      )

      this.players.set(playerData.id, player)
    }

  }

  handlePlayerMove(position) {

    if(position.id === this.localPlayerId){
      return
    }

    const player = this.players.get(position.id)
    console.log(player)
    if(player){
      player.updatePosition(position.x, position.y, position.direction)
      player.playAnimation()
    

  }
  
  }

  handlePlayerLeft(playerId) {

    if(this.players.has(playerId)) {
      console.log(`Player Left: ${playerId}`)
      const player = this.players.get(playerId)
      this.players.delete(playerId)
    }

  }

  update() {



  }
}