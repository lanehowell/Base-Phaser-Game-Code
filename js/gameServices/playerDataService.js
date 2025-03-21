import networkService from "./networkService.js"

class PlayerDataService {
    constructor() {
        this.data = {
            // Basic Info
            id: null,
            name: '',
            sprite: '',
            position: { x: 700, y: 700, direction: 'down', map: 'STARTING_MAP_SCENE' },

            // Stats
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,

            // Inventory
            inventory: [],
            gold: 0,
            maxInventorySpace: 100,
            equippedItems: {
                weapon: null,
                armor: null,
                pickaxe: null,
                shovel: null,
                hoe: null,
            },

            // Skills
            skills: {
                mining: { level: 1, exp: 0 },
                gathering: { level: 1, exp: 0 },
                logging: { level: 1, exp: 0 },
                fishing: { level: 1, exp: 0 },
                breeding: { level: 1, exp: 0 },
                catching: { level: 1, exp: 0 },
            },

            // Meta Data
            lastMessage: '',
            lastAction: '',
            itemInHand: null
        }

        // To track if data needs to be synced
        this.dirty = false

        // Communicate events across scenes
        this.events = new Phaser.Events.EventEmitter()

        this.lastServerSync = 0;
        this.serverSyncInterval = 500;

        this.syncWithServer = () =>{
            const now = Date.now();
            if (networkService.isConnected && now - this.lastServerSync >= this.serverSyncInterval) {
                networkService.sendPlayerData(this.data);
                this.lastServerSync = now;
            }
        }

        // networkService.events.on('connected', () =>{
        //     this.syncWithServer()
        // })

    }

    syncWithLocalStorage() {
        if (this.dirty) {
            localStorage.setItem('playerData', JSON.stringify(this.data))
        }
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('playerData')

        if(savedData){
            this.data = JSON.parse(savedData)
        }

        return this.data
    }

    updatePosition(x, y, direction, mapId) {
        this.data.position = { x, y, direction: direction || this.data.position.direction, map: mapId }
        this.dirty = true
        this.syncWithLocalStorage()
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