// PRELOAD SCENE HANDLES LOADING OF ALL ASSETS NEEDED FOR GAME

import { MAP_KEYS } from "../../assets/maps/mapKeys.js";
import { TILESET_KEYS } from "../../assets/maps/tilesets/tilesetKeys.js";
import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js";
import { SCENE_KEYS } from "./SceneKeys.js";

export class PreloadScene extends Phaser.Scene {    
    constructor(map) {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE
        })
        this.map = map
    }

    preload() {

        const spritesPath = 'assets/sprites'
        const mapsPath = 'assets/maps'
        const frameSize = { frameWidth: 192 / 4, frameHeight: 192 / 3 }

        // Load Player Assets
        this.load.spritesheet(SPRITE_KEYS.PLAYER_DOWN, `${spritesPath}/player/playerDown.png`, frameSize)
        this.load.spritesheet(SPRITE_KEYS.PLAYER_UP, `${spritesPath}/player/playerUp.png`, frameSize)
        this.load.spritesheet(SPRITE_KEYS.PLAYER_LEFT, `${spritesPath}/player/playerLeft.png`, frameSize)
        this.load.spritesheet(SPRITE_KEYS.PLAYER_RIGHT, `${spritesPath}/player/playerRight.png`, frameSize)

        // Load Map Assets
        this.load.image(TILESET_KEYS.BEACH_TILESET, `${mapsPath}/tilesets/beach_tiles.png`)
        this.load.tilemapTiledJSON(MAP_KEYS.STARTING_MAP, this.map)

        // Load UI Elements
        this.load.image('UIHeart', 'assets/ui/heart.png')
        this.load.image('UIEnergy', 'assets/ui/energy.png')

        // Load Bitmap Fonts
        this.load.bitmapFont('Pixeled', 'assets/fonts/thick.png', 'assets/fonts/thick.xml')

    }

    create() {

        this.scene.start(SCENE_KEYS.STARTING_MAP_SCENE, { mapId: MAP_KEYS.STARTING_MAP })

    }
}