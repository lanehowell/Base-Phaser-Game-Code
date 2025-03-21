import { Player } from "../entities/player.js";

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
}