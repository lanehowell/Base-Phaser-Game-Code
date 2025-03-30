import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js"

export class NetworkPlayer {
  constructor(scene, id, x, y, direction, name) {
    this.scene = scene
    this.id = id
    this.sprite = null
    this.direction = direction || 'down'
    this.name = name
    this.currentTween = null
    this.tweenInProgress = false
    this.lastUpdateTime = 0
    this.movementTimeout = null

    this.init(x, y)
  }

  init(x, y) {
  
    this.sprite = this.scene.physics.add.sprite(x, y, `PLAYER_${this.direction.toUpperCase()}`).setScale(0.5)

    this.sprite.body.immovable = true

    this.sprite.setInteractive({useHandCursor: true})

    this.createNameTag()
    this.createAnimations()
    this.setupHoverEvents()

  }

  update() {

    if (this.tweenInProgress) {
      if (!this.sprite.anims.isPlaying) {
        this.sprite.anims.play(this.direction, true)
      }
    } else if (this.scene.time.now - this.lastUpdateTime > 100) {
      this.stopAnimation()
    }

  }

  createAnimations() {
  
    const frameRate = 8

    if(!this.scene.anims.exists('down')){
      this.scene.anims.create({
        key: 'down',
        frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_DOWN, { start: 0, end: 3 }),
        frameRate: frameRate,
        repeat: -1,
    })
    }
    if(!this.scene.anims.exists('up')){
      this.scene.anims.create({
        key: 'up',
        frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_UP, { start: 0, end: 3 }),
        frameRate: frameRate,
        repeat: -1,
    })
    }
    if(!this.scene.anims.exists('left')){
      this.scene.anims.create({
        key: 'left',
        frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_LEFT, { start: 0, end: 3 }),
        frameRate: frameRate,
        repeat: -1,
    })
    }
    if(!this.scene.anims.exists('right')){
      this.scene.anims.create({
        key: 'right',
        frames: this.scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER_RIGHT, { start: 0, end: 3 }),
        frameRate: frameRate,
        repeat: -1,
    })
    }
  
  }
  
  playAnimation() {
    if(this.sprite && this.direction){
      this.sprite.anims.play(this.direction, true)
    }
  }

  stopAnimation() {
    
    this.sprite.anims.stop()

  }

  updatePosition(x, y, direction) {

    if(this.currentTween){
      this.currentTween.stop()
    }
  
    if (this.movementTimeout) {
      this.scene.time.removeEvent(this.movementTimeout);
    }
  
    if(direction !== this.direction){
      this.direction = direction
      this.sprite.setTexture(`PLAYER_${direction.toUpperCase()}`)
    }
  
    this.tweenInProgress = true
    this.sprite.anims.play(this.direction, true)
  
    this.currentTween = this.scene.tweens.add({
      targets: this.sprite,
      x: x,
      y: y,
      duration: 45,
      ease: 'Linear',
      onUpdate: () => {
        this.updateNameTagPosition()
      },
      onComplete: () => {
        this.movementTimeout = this.scene.time.delayedCall(50, () => {
          this.tweenInProgress = false
          this.stopAnimation()
        })
      }
    })
  
    this.lastUpdateTime = this.scene.time.now

  }

  createNameTag() {

    this.nameTagContainer = this.scene.add.container(0, 0)

    // Nametag Text
    this.nameText = this.scene.add.bitmapText(0, 0, 'Pixeled', this.name, 8).setOrigin(0.5, 0.5)

    // Nametag Background
    const bgWidth = this.nameText.width + 12
    const bgHeight = this.nameText.height + 4
    this.nametagBackground = this.scene.add.graphics()
    this.nametagBackground.fillStyle(0x000000, 1)
    this.nametagBackground.fillRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 6)

    this.nameText.x = 0
    this.nameText.y = 2

    this.nameTagContainer.add(this.nametagBackground)
    this.nameTagContainer.add(this.nameText)

    this.nameTagContainer.setVisible(false)

    this.updateNameTagPosition()

  }

  updateNameTagPosition() {

    this.nameTagContainer.x = Math.floor(this.sprite.x)
    this.nameTagContainer.y = Math.floor(this.sprite.y - (this.sprite.height * 0.5))

  }

  getSprite() {

    return this.sprite

  }

  setupHoverEvents() {

    this.sprite.on('pointerover', () =>{
      this.nameTagContainer.setVisible(true)
    })

    this.sprite.on('pointerout', () =>{
      this.nameTagContainer.setVisible(false)
    })

  }

  destroy() {

    this.sprite.destroy()
    this.nameTag.destroy()

  }

}

