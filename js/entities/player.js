import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js";
import playerDataService from "../gameServices/playerDataService.js";
import networkService from "../gameServices/networkService.js"

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
        this.chatBubble = null
        this.messageTween = null
        this.messageTimeout = null

        this.init()
    }

    init() {
        const playerData = playerDataService.data

        if (playerDataService.data && playerDataService.data.position.map === this.mapId) {
            this.sprite = this.scene.physics.add.sprite(playerData.position.x, playerData.position.y, `PLAYER_${playerData.position.direction.toUpperCase()}`).setScale(.5)
        } else {
            this.sprite = this.scene.physics.add.sprite(700, 700, SPRITE_KEYS.PLAYER_DOWN).setScale(.5)
        }

        this.sprite.body.setDamping(true)

        this.createAnimations()

        this.scene.game.events.on('send-message', this.showMessageBubble, this)
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

        // Always update chat bubble position in update loop
        this.updateChatBubblePosition()
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
            this.sprite.setFrame(0)
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

        if (!this.scene.anims.exists('down')) {
            this.scene.anims.create({
                key: 'down',
                frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_DOWN, { start: 0, end: 3 }),
                frameRate: frameRate,
                repeat: -1,
            })
        }
        if (!this.scene.anims.exists('up')) {
            this.scene.anims.create({
                key: 'up',
                frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_UP, { start: 0, end: 3 }),
                frameRate: frameRate,
                repeat: -1,
            })
        }
        if (!this.scene.anims.exists('left')) {
            this.scene.anims.create({
                key: 'left',
                frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_LEFT, { start: 0, end: 3 }),
                frameRate: frameRate,
                repeat: -1,
            })
        }
        if (!this.scene.anims.exists('right')) {
            this.scene.anims.create({
                key: 'right',
                frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_RIGHT, { start: 0, end: 3 }),
                frameRate: frameRate,
                repeat: -1,
            })
        }
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
    setupCollisions(barriers) {
        this.scene.physics.add.collider(this.sprite, barriers)
    }

    // Add collions for portals on the map
    setupPortals(portals) {
        this.scene.physics.add.collider(this.sprite, portals, (player, portal) => {
            networkService.sendTeleportRequest(portal.name)
            this.sprite.setVelocity(0, 0)
        })
    }

    showMessageBubble(message) {

        this.cleanupChatBubble(false)

        if (!this.chatBubble) {
            this.chatBubble = this.scene.add.container(this.sprite.x, this.sprite.y - (this.sprite.height * 0.5));
            this.chatBubble.setDepth(1000)
            this.chatBubble.setAlpha(1)
            this.chatBubble.setScale(0.5)
        } else {

            this.chatBubble.removeAll(true)
            this.chatBubble.setAlpha(1)
            this.chatBubble.setScale(0.5)
        }

        let chatText = this.scene.add.bitmapText(0, 0, 'Pixeled', message, 8).setOrigin(0.5, 0.5)
        chatText.setTint(0x000000)
        chatText.x = 0
        chatText.y = 2

        const bgWidth = chatText.width + 12
        const bgHeight = chatText.height + 4
        const background = this.scene.add.graphics()
        background.fillStyle(0xffffff, 1)
        background.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 6)

        this.chatBubble.add(background)
        this.chatBubble.add(chatText)

        this.updateChatBubblePosition()

        this.messageTween = this.scene.tweens.add({
            targets: this.chatBubble,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        })

        this.messageTimeout = this.scene.time.delayedCall(5000, () => {
            this.fadeOutChatBubble()
        })
    }

    fadeOutChatBubble() {
        if (this.chatBubble) {
            this.messageTween = this.scene.tweens.add({
                targets: this.chatBubble,
                alpha: 0,
                scale: 0.8,
                duration: 200,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    this.cleanupChatBubble(true)
                }
            });
        }
    }

    cleanupChatBubble(destroyContainer) {
        if (this.messageTween) {
            this.messageTween.stop()
            this.messageTween = null
        }

        if (this.messageTimeout) {
            this.messageTimeout.remove()
            this.messageTimeout = null
        }

        if (destroyContainer && this.chatBubble) {
            this.chatBubble.destroy()
            this.chatBubble = null
        }
    }

    updateChatBubblePosition() {
        if (this.chatBubble) {
            this.chatBubble.x = this.sprite.x
            this.chatBubble.y = this.sprite.y - (this.sprite.height * 0.5)
        }
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }

    setPosition(x, y) {
        this.sprite.x = x
        this.sprite.y = y
        return this
    }

    getSprite() {
        return this.sprite
    }

    destroy() {
        this.scene.game.events.off('send-message', this.showMessageBubble, this)

        this.cleanupChatBubble(true)

        if (this.sprite) {
            this.sprite.destroy()
        }
    }
}