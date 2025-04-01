import { NetworkPlayer } from "../entities/networkPlayer.js"
import networkService from "./networkService.js"
import playerDataService from "./playerDataService.js"
import { Player } from "../entities/player.js"

export class NetworkPlayerManager {
  constructor(scene) {
    this.scene = scene
    this.players = new Map()
    this.localPlayerId = playerDataService.data.id

    this.cleanup()

    this.setupNetworkListeners()
    this.loadExistingPlayers()
  }

  cleanup() {
    if (this.players) {
      this.players.forEach(player => {
        if (player && player.destroy) {
          player.destroy()
        }
      })
      this.players.clear()
    }

    if (networkService.events) {
      networkService.events.off('playerJoined', this.handlePlayerJoined, this)
      networkService.events.off('playerMoved', this.handlePlayerMove, this)
      networkService.events.off('playerLeft', this.handlePlayerLeft, this)
      networkService.events.off('chatReceived', this.handleChatReceived, this)
    }
  }

  loadExistingPlayers() {

    networkService.initialPlayers.forEach(player => {
      // Server handles filtering out local player
      if (!playerDataService.data.id === player.id) {
        const newPlayer = new NetworkPlayer(this.scene, player.id, player.position.x, player.position.y, player.position.direction, player.name)
        this.players.set(newPlayer.id, newPlayer)
      }
    })

  }

  setupNetworkListeners() {

    this.handlePlayerJoined = this.handlePlayerJoined.bind(this)
    this.handlePlayerMove = this.handlePlayerMove.bind(this)
    this.handlePlayerLeft = this.handlePlayerLeft.bind(this)
    this.handleChatReceived = this.handleChatReceived.bind(this)

    networkService.events.on('playerJoined', (playerData) => {
      this.handlePlayerJoined(playerData)
    })

    networkService.events.on('playerMoved', (position) => {
      this.handlePlayerMove(position)
    })

    networkService.events.on('playerLeft', (playerId) => {
      this.handlePlayerLeft(playerId)
    })

    networkService.events.on('chatReceived', (message) => {
      this.handleChatReceived(message)
    })

  }

  handlePlayerJoined(playerData) {

    if (playerData.id === this.localPlayerId) {
      return
    }

    console.log(`Player Joined!: `, playerData.position)

    if (!this.players.has(playerData.id)) {
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

    if (position.id === this.localPlayerId) {
      return
    }

    const player = this.players.get(position.id)
    if (player) {
      player.updatePosition(position.x, position.y, position.direction)
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

    if (this.players.has(playerId)) {
      console.log(`Player Left: ${playerId}`)
      const player = this.players.get(playerId)
      player.destroy()
      this.players.delete(playerId)
    }

  }

  handleChatReceived(message) {

    console.log(message)

    const player = this.players.get(message.sender)
    if (playerDataService.data.id !== message.sender) {
      player.showChatBubble(message.message)
    }

  }

  getNetworkPlayersForCollisions() {

    const playerSprites = []
    this.players.forEach(player => {
      const playerSprite = player.getSprite()
      playerSprites.push(playerSprite)
    })

    const playersGroup = this.scene.physics.add.group(playerSprites)

    playersGroup.getChildren().forEach((sprite) => {
      sprite.body.immovable = true
    })

    return playersGroup

  }

  update() {

    this.players.forEach(player => {
      player.update()
    })

  }
}