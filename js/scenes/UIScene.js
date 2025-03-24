import { SCENE_KEYS } from "./SceneKeys.js";

export class UIScene extends Phaser.Scene {
  constructor(){
    super({ key: SCENE_KEYS.UI_SCENE})
  }

  create() {

    this.uiContainer = this.add.container(10, 10)

    // this.panel = this.add.rectangle(0, 0, 300, 80, 0X000000, .5).setOrigin(0, 0).setStrokeStyle(1, 0xffffff)
    // this.uiContainer.add(this.panel)

    this.healthBar = this.add.rectangle(20, 17, 200, 12, 0xff0000, 1).setOrigin(0).setStrokeStyle(3, 0x000000, 1)
    this.uiContainer.add(this.healthBar)

    this.healthIcon = this.add.image(10, 10, 'UIHeart').setOrigin(0).setScale(2)
    this.uiContainer.add(this.healthIcon)

    this.energyBar = this.add.rectangle(20, 52, 200, 12, 0x00b7ef, 1).setOrigin(0).setStrokeStyle(3, 0x000000, 1)
    this.uiContainer.add(this.energyBar)

    this.energyIcon = this.add.image(10, 45, 'UIEnergy').setOrigin(0).setScale(2)
    this.uiContainer.add(this.energyIcon)

  }

}