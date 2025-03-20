import { MAP_KEYS } from "../../assets/maps/mapKeys.js";
import { TILESET_KEYS } from "../../assets/maps/tilesets/tilesetKeys.js";
import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js";
import { SCENE_KEYS } from "./SceneKeys.js";

export class StartingMapScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.STARTING_MAP_SCENE
        })
    }

    create() {

        this.map = this.createMap()
        this.player = this.createPlayer().setScale(.5)

        // LOAD CAMERA
        this.cameras.main.startFollow(this.player, true)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(2)

        window.addEventListener('resize', () => {
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.centerOn(this.player.x, this.player.y)
        })

    }

    update() {
        
    }

    createMap() {

        // Load Tilemap
        const map = this.make.tilemap({ key: MAP_KEYS.STARTING_MAP, tileHeight: 16, tileWidth: 16 });
        
        const beach_tiles = map.addTilesetImage('beach_tiles', TILESET_KEYS.BEACH_TILESET);
        
        const layer = map.createLayer('Ground Layer', beach_tiles, 0, 0);
        
        return map;
    }

    createPlayer() {
        
        return this.player = this.add.sprite(200,200, SPRITE_KEYS.PLAYER_DOWN)

    }

}
