import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js"

export class NetworkPlayer {
  constructor(scene, id, x, y, direction) {
    this.scene = scene
    this.id = id
    this.sprite = null
    this.direction = direction || 'down'

    this.init(x, y)
  }

  init(x, y) {
  
    this.sprite = this.scene.physics.add.sprite(x, y, `PLAYER_${this.direction.toUpperCase()}`).setScale(0.5)

    this.createAnimations()

  }

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

    this.playAnimation()

  }

  getSprite() {

    return this.sprite

  }

  destroy() {

    this.sprite.destroy()

  }

}

