import { SCENE_KEYS } from "../scenes/SceneKeys.js";
import networkService from "./networkService.js"

class PlayerDataService {
    constructor() {
        // Holds Data for player. Populated by the updateFromServer() method
        this.data = {}

        // To track if data needs to be synced
        this.dirty = false

        // Communicate events across scenes
        this.events = new Phaser.Events.EventEmitter()

        this.lastServerSync = 0;
        this.serverSyncInterval = 50;

        this.syncWithServer = () =>{
            const now = Date.now();
            if (networkService.isConnected && now - this.lastServerSync >= this.serverSyncInterval) {
                networkService.sendPlayerData(this.data)
                console.log("Attempting sync: ", this.data.position)
                this.lastServerSync = now
            }
        }

        networkService.events.on('playerDataReceived', (data) => {
            this.updateFromServer(data)
        })

    }

    updateFromServer(serverData) {
        if (serverData) {
            this.data = serverData
            this.dirty = false
            
            // Emit event for other components to react
            this.events.emit('playerDataUpdated', this.data)
            console.log("PLAYER DATA LOADED FROM SERVER: ", this.data)
        }
    }

    updatePosition(x, y, direction, mapId) {
        this.data.position = {x, y, direction: direction || this.data.position.direction, map: mapId }
        this.dirty = true
        this.syncWithServer()
        this.events.emit('positionChanged', this.data.position)
    }

    addItemToInventory(item) {
        if (this.data.inventory.length < this.data.maxInventorySpace) {
            this.data.inventory.push(item)
            this.dirty = true
            this.events.emit('inventoryChanged', this.data.inventory)
            return true
        } else return false
    }

    gainSkillExp(skillName, amount) {
        if (this.data.skills[skillName]) {
            this.data.skills[skillName].exp += amount

            // Check for Level Up
            const requiredExp = this.getRequiredExpForLevel(this.data.skills[skillName].level)
            if (this.data.skills[skillName].exp >= requiredExp) {
                this.data.skills[skillName].level++
                this.data.skills[skillName].exp -= requiredExp
                this.events.emit('skillLevelUp', { skill: skillName, level: this.data.skills[skillName].level });
            }
        }

        this.dirty = true
        this.events.emit('skillExpChanged', { skill: skillName, exp: this.data.skills[skillName].exp });
    }

    getRequiredExpForLevel(level) {
        return 100 * Math.pow(1.5, level - 1)
    }

}

const playerDataService = new PlayerDataService()

export default playerDataService