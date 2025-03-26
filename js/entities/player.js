import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js";
import playerDataService from "../gameServices/playerDataService.js";

export class Player {
    constructor(scene, mapId) {
        this.scene = scene
        this.sprite = null
        this.cursors = null
        this.movementSpeed = 100
        this.direction = 'down'
        this.mapId = mapId
        this.events = new Phaser.Events.EventEmitter()
        this.id = playerDataService.data.id

        this.init()
    }

    init() {

        const playerData = playerDataService.data
        
        if(playerDataService.data && playerDataService.data.position.map === this.mapId) {
            this.sprite = this.scene.physics.add.sprite(playerData.position.x, playerData.position.y, `PLAYER_${playerData.position.direction.toUpperCase()}`).setScale(.5)
        } else {
            this.sprite = this.scene.physics.add.sprite(700, 700, SPRITE_KEYS.PLAYER_DOWN).setScale(.5)
        }

        this.sprite.body.setDamping(true)

        this.createAnimations()

    }

    update() {

        const moveInputs = {
            up: this.cursors.up.isDown,
            left: this.cursors.left.isDown,
            down: this.cursors.down.isDown,
            right: this.cursors.right.isDown
        }

        this.move(moveInputs)

        this.sprite.x = Math.round(this.sprite.x)
        this.sprite.y = Math.round(this.sprite.y)

    }

    move(input) {

        let moveX = 0
        let moveY = 0
        let direction = ''
        
        // Process input
        if (input.left) {
            moveX = -1
            direction = 'left'
        } else if (input.right) {
            moveX = 1
            direction = 'right'
        }
        
        if (input.up) {
            moveY = -1
            direction = 'up'
        } else if (input.down) {
            moveY = 1
            direction = 'down'
        }
        
        // Only process movement if actually moving
        if (moveX === 0 && moveY === 0) {
            this.sprite.setVelocity(0, 0)
            this.sprite.anims.stop()
            return
        }
        
        // Normalize movement
        const movement = new Phaser.Math.Vector2(moveX, moveY).normalize()
        
        // Calculate the velocity
        const velocityX = movement.x * this.movementSpeed
        const velocityY = movement.y * this.movementSpeed
        
        // Set the velocity directly
        this.sprite.setVelocity(velocityX, velocityY)
        
        // Play animation
        if (direction) {
            this.sprite.anims.play(direction, true)
        }
        
        // Save position to data service
        playerDataService.updatePosition(
            Math.round(this.sprite.x), 
            Math.round(this.sprite.y), 
            direction, 
            this.mapId
        )

    }

    // Set up animations for player sprite
    createAnimations() {

        const frameRate = 8

        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_DOWN, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        })

        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_UP, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        })

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_LEFT, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        })

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_RIGHT, { start: 0, end: 3 }),
            frameRate: frameRate,
            repeat: -1,
        })

    }

    // Set up keybinds for player
    setupControls() {
        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    // Add collions for any barriers on the map
    setupCollisions(barriers){
        this.scene.physics.add.collider(this.sprite, barriers)
    }
    
    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }
    
    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
        return this;
    }
    
    getSprite() {
        return this.sprite;
    }
    
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }

}