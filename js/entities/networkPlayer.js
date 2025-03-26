import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js"

export class NetworkPlayer {
  constructor(scene, id, x, y, direction, name) {
    this.scene = scene
    this.id = id
    this.sprite = null
    this.direction = direction || 'down'
    this.name = name
    this.currentTween = null

    this.init(x, y)
  }

  init(x, y) {
  
    this.sprite = this.scene.physics.add.sprite(x, y, `PLAYER_${this.direction.toUpperCase()}`).setScale(0.5)

    this.createNameTag()

    this.createAnimations()

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

    this.sprite.x = x
    this.sprite.y = y

    if(direction !== this.direction){
      this.direction = direction
      this.sprite.setTexture(`PLAYER_${direction.toUpperCase()}`)
    }

    this.updateNameTagPosition()

  }

  createNameTag() {

    this.nameTag = this.scene.add.bitmapText(0, 0, 'Pixeled', this.name, 8).setOrigin(0.5, 1)

    this.updateNameTagPosition()

  }

  updateNameTagPosition() {

    this.nameTag.x = Math.floor(this.sprite.x)
    this.nameTag.y = Math.floor(this.sprite.y - (this.sprite.height * 0.3))

  }

  getSprite() {

    return this.sprite

  }

  destroy() {

    this.sprite.destroy()
    this.nameTag.destroy()

  }

}

