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

        this.createMap()
        this.createPlayer()
        this.createMovement()
        this.createAnimations()
        this.createCamera()
        this.baseMovementSpeed = 100
        this.movementSpeed = this.baseMovementSpeed

        // LOAD CAMERA


        window.addEventListener('resize', () => {
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.centerOn(this.player.x, this.player.y)
        })

    }

    update() {

        this.handleMovement()

    }

    createMap() {

        // Load Tilemap
        this.map = this.make.tilemap({ key: MAP_KEYS.STARTING_MAP, tileHeight: 16, tileWidth: 16 });

        const beach_tiles = this.map.addTilesetImage('beach_tiles', TILESET_KEYS.BEACH_TILESET);

        const layer = this.map.createLayer('Ground Layer', beach_tiles, 0, 0);

    }

    createPlayer() {

        this.player = this.physics.add.sprite(200, 200, SPRITE_KEYS.PLAYER_DOWN).setScale(.5)

    }

    createAnimations() {

        const frameRate = 8

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_DOWN, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_UP, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_LEFT, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_RIGHT, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        });

    }

    createMovement() {
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    createCamera() {

        this.cameras.main.startFollow(this.player, true)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(3)
        this.cameras.main.on('zoomchanged', this.onZoomChanged, this)
        this.targetPosition = new Phaser.Math.Vector2()
        this.cameraSmoothing = 0.08

    }

    handleMovement() {

        let moveX = 0
        let moveY = 0
        let direction = ''

        // @ts-ignore
        if (this.cursors.left.isDown) {
            moveX = -1
            direction = 'left'
            // @ts-ignore
        } else if (this.cursors.right.isDown) {
            moveX = 1
            direction = 'right'
        }

        // @ts-ignore
        if (this.cursors.up.isDown) {
            moveY = -1
            direction = 'up'
            // @ts-ignore
        } else if (this.cursors.down.isDown) {
            moveY = 1
            direction = 'down'
        }

        const movement = new Phaser.Math.Vector2(moveX, moveY).normalize()

        this.player.setVelocity(
            movement.x * this.movementSpeed,
            movement.y * this.movementSpeed
        )

        this.player.x = Math.round(this.player.x);
        this.player.y = Math.round(this.player.y);

        // Play animation based on direction
        if (direction) {
            this.player.anims.play(direction, true)
        } else {
            this.player.anims.stop()
        }

        // Smoother Camera Movement
        this.targetPosition.x = this.player.x
        this.targetPosition.y = this.player.y

        this.cameras.main.scrollX += (this.targetPosition.x - this.cameras.main.scrollX) * this.cameraSmoothing
        this.cameras.main.scrollY += (this.targetPosition.y - this.cameras.main.scrollY) * this.cameraSmoothing

        this.cameras.main.scrollX = Math.round(this.cameras.main.scrollX)
        this.cameras.main.scrollY = Math.round(this.cameras.main.scrollY)

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    }

    onZoomChanged(zoom) {
        this.movementSpeed = this.baseMovementSpeed / zoom;
    }


}
