import { Player } from "../entities/player.js";
import { NetworkPlayerManager } from "../gameServices/networkPlayerManager.js";
import networkService from "../gameServices/networkService.js";

export class BaseScene extends Phaser.Scene {

    createPlayer(mapId) {
        this.player = new Player(this, mapId)

        // @ts-ignore
        if(this.barriers){
            // @ts-ignore
            this.player.setupCollisions(this.barriers)
            this.player.setupControls()
        }

        return this.player
    }

    setupNetworkPlayerManager() {

        this.networkPlayerManager = new NetworkPlayerManager(this)
        this.setupNetworkPlayerCollisions()

        return this.networkPlayerManager

    }

    setupNetworkPlayerCollisions() {

        this.networkCollisionsTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if(this.networkPlayerCollider){
                    this.networkPlayerCollider.destroy()
                }

                const networkPlayers = this.networkPlayerManager.getNetworkPlayersForCollisions()

                this.networkPlayerCollider = this.physics.add.collider(this.player.getSprite(), networkPlayers)
            },
            loop: true
        })

    }

    cleanupNetworkCollisions() {
        if (this.networkCollisionsTimer) {
            this.networkCollisionsTimer.destroy()
        }
        if (this.networkPlayerCollider) {
            this.networkPlayerCollider.destroy()
        }
    }
}