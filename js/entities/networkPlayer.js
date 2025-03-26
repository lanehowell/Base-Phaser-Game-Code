import { SPRITE_KEYS } from "../../assets/sprites/spriteKeys.js"

export class NetworkPlayer {
  constructor(scene, id, x, y, direction, name) {
    this.scene = scene
    this.id = id
    this.sprite = null
    this.direction = direction || 'down'
    this.name = name

    this.init(x, y)
  }

  init(x, y) {
  
    this.sprite = this.scene.physics.add.sprite(x, y, `PLAYER_${this.direction.toUpperCase()}`).setScale(0.5)

    this.createNameTag()

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
    this.updateNameTagPosition()

  }

  createNameTag(name) {

    this.nameTag = this.scene.add.text(0, 0, this.name, {
      font: '10px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center'
    }).setOrigin(0.5, 1)

    this.updateNameTagPosition()

  }

  updateNameTagPosition() {

    this.nameTag.x = this.sprite.x
    this.nameTag.y = this.sprite.y - (this.sprite.height * 0.5)

  }

  getSprite() {

    return this.sprite

  }

  destroy() {

    this.sprite.destroy()

  }

}

