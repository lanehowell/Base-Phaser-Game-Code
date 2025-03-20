import { MAP_KEYS } from "../../assets/maps/mapKeys.js";
import { TILESET_KEYS } from "../../assets/maps/tilesets/tilesetKeys.js";
import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js";
import { SCENE_KEYS } from "./SceneKeys.js";
import { ToolSystem } from "../utilityClasses/toolSystem.js";

export class StartingMapScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.STARTING_MAP_SCENE
        })

    }

    create() {

        this.input.mouse.disableContextMenu()
        this.createMap()
        this.createPlayer()
        this.createMovement()
        this.createAnimations()
        this.createCamera()
        // this.handleClicks()
        this.handleZoom()
        this.movementSpeed = 100

        this.toolSystem = new ToolSystem(this)
        const toolElement = document.createElement('div');
        toolElement.style.position = 'absolute';
        toolElement.style.top = '60px';
        toolElement.style.left = '10px';
        toolElement.style.padding = '8px 12px';
        toolElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toolElement.style.color = 'white';
        toolElement.style.fontFamily = 'Arial, sans-serif';
        toolElement.style.fontSize = '18px';
        toolElement.style.borderRadius = '4px';
        toolElement.style.zIndex = '1000';
        toolElement.id = 'tool-display';
        toolElement.innerText = 'Tool: None';

        // Add the element to the document
        document.body.appendChild(toolElement);

        // Store a reference to update later
        this.toolDisplay = toolElement;

        window.addEventListener('resize', () => {
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.centerOn(this.player.x, this.player.y)
        })

    }

    update() {

        this.handleMovement()

        if (this.toolDisplay && this.toolSystem) {
            this.toolDisplay.innerText = `Tool: ${this.toolSystem.getToolStatus()}`;
        }

    }

    createMap() {

        // Load Tilemap
        this.map = this.make.tilemap({ key: MAP_KEYS.STARTING_MAP, tileHeight: 16, tileWidth: 16 });

        const beach_tiles = this.map.addTilesetImage('beach_tiles', TILESET_KEYS.BEACH_TILESET);
        console.log("Available tiles:", beach_tiles)

        const water_layer = this.map.createLayer('Water Layer', beach_tiles, 0, 0);
        this.ground_layer = this.map.createLayer('Ground Layer', beach_tiles, 0, 0);
        this.ground_layer.setInteractive()
        const paths_layer = this.map.createLayer('Paths Layer', beach_tiles, 0, 0);

        //Set up barriers
        this.barriers = this.physics.add.group({ immovable: true })
        this.barrierObjects = this.map.getObjectLayer('Barriers').objects
        this.barrierObjects.forEach((barrierObject) => {
            const barrier = this.physics.add.sprite(
                barrierObject.x + (barrierObject.width / 2),
                barrierObject.y + (barrierObject.height / 2),
                null
            )

            barrier.setSize(barrierObject.width, barrierObject.height)

            barrier.setVisible(false)

            barrier.setImmovable(true)
            this.barriers.add(barrier)
        })

    }

    createPlayer() {

        this.player = this.physics.add.sprite(700, 700, SPRITE_KEYS.PLAYER_DOWN).setScale(.5)

        this.physics.add.collider(this.player, this.barriers)

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

        this.cameraZoom = 2
        this.cameraMinZoom = 1.5
        this.cameraMaxZoom = 4
        this.cameras.main.startFollow(this.player, true)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.cameraZoom)
        this.targetPosition = new Phaser.Math.Vector2()
        this.cameraSmoothing = 0.08

    }

    createTools() {



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
        const effectiveCameraSmoothing = this.cameraSmoothing

        this.cameras.main.scrollX += (this.targetPosition.x - this.cameras.main.scrollX) * effectiveCameraSmoothing
        this.cameras.main.scrollY += (this.targetPosition.y - this.cameras.main.scrollY) * effectiveCameraSmoothing

        this.cameras.main.scrollX = Math.round(this.cameras.main.scrollX)
        this.cameras.main.scrollY = Math.round(this.cameras.main.scrollY)

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    }

    // handleClicks() {
    //     this.ground_layer.on('pointerdown', (pointer) => {
    //         if (pointer.button === 0) {
    //             const clickedTile = this.map.getTileAtWorldXY(pointer.worldX, pointer.worldY, true, this.cameras.main, 'Ground Layer')
    //             if (clickedTile) {
    //                 this.map.putTileAt(-1, clickedTile.x, clickedTile.y, true, 'Ground Layer')
    //             }
    //         } else if (pointer.button === 2) {
    //             const clickedTile = this.map.getTileAtWorldXY(pointer.worldX, pointer.worldY, true, this.cameras.main, 'Ground Layer')
    //             this.map.putTileAt(476, clickedTile.x, clickedTile.y, true, 'Ground Layer')
    //         }
    //     })
    // }

    handleZoom() {
        this.input.keyboard.on('keydown', (e) => {
            if (e.key === '=') {
                if (this.cameras.main.zoom < this.cameraMaxZoom) {
                    this.cameras.main.zoom += .5
                }
            } else if (e.key === "-") {
                if (this.cameras.main.zoom > this.cameraMinZoom) {
                    this.cameras.main.zoom -= .5
                }
            }
        })
    }
}
