import networkService from "../gameServices/networkService.js";
import { SCENE_KEYS } from "./SceneKeys.js";

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.UI_SCENE })

    this.events = new Phaser.Events.EventEmitter()

    this.inputElement = null
    this.documentClickHandler = null
    this.inputValue = null
  }

  create() {

    this.uiContainer = this.add.container(10, 10)

    this.healthBar = this.add.rectangle(20, 17, 200, 12, 0xff0000, 1).setOrigin(0).setStrokeStyle(3, 0x000000, 1)
    this.uiContainer.add(this.healthBar)

    this.healthIcon = this.add.image(10, 10, 'UIHeart').setOrigin(0).setScale(2)
    this.uiContainer.add(this.healthIcon)

    this.energyBar = this.add.rectangle(20, 52, 200, 12, 0x00b7ef, 1).setOrigin(0).setStrokeStyle(3, 0x000000, 1)
    this.uiContainer.add(this.energyBar)

    this.energyIcon = this.add.image(10, 45, 'UIEnergy').setOrigin(0).setScale(2)
    this.uiContainer.add(this.energyIcon)

    this.createChatUI()

    this.scale.on('resize', this.handleResize, this)

  }

  createChatUI() {
    const gameHeight = this.scale.height
    const gameWidth = this.scale.width

    if (this.chatContainer) {
      this.chatContainer.destroy()
    }

    this.chatContainer = this.add.container(0, gameHeight - 20)

    this.panel = this.add.rectangle(15, 0, gameWidth / 2.5, 40, 0X000000, .5).setOrigin(0, 1)

    this.chatContainer.add(this.panel)

    if (this.inputValue) {
      this.currentInputValue = this.inputElement.value || ''
    }

    if (this.inputElement && this.inputElement.parentNode) {
      this.inputElement.parentNode.removeChild(this.inputElement)
      this.inputElement = null
    }

    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler)
      this.documentClickHandler = null
    }

    this.createTextInput()
  }

  createTextInput() {

    const gameHeight = this.scale.height
    const gameWidth = this.scale.width

    const inputElement = document.createElement('input')
    inputElement.type = 'text'
    inputElement.placeholder = 'Type message...'
    inputElement.style = `
      width: ${gameWidth / 3}px;
      height: 30px;
      padding: 5px;
      position: absolute;
      top: ${gameHeight - 4}px;
      left: 20px;
      border: 2px solid #333;
      border-radius: 5px;
      background: transparent;
      font-family: 'Press Start 2P', sans-serif;
      color: white;
    `

    inputElement.value = this.inputValue
    this.inputElement = inputElement

    inputElement.addEventListener('input', () => {
      this.inputValue = inputElement.value
    })

    inputElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.game.events.emit('send-message', inputElement.value)
        networkService.sendChatMessage(inputElement.value)
        inputElement.value = ''
        inputElement.blur()
      } else if (event.key === 'Escape') {
        inputElement.blur()
      }
      event.stopPropagation()
    })

    const documentClickHandler = (event) => {
      if (event.target !== inputElement) {
        inputElement.blur()
      }
    }

    this.documentClickHandler = documentClickHandler

    document.addEventListener('click', documentClickHandler)

    document.body.appendChild(inputElement)
  }

  handleResize() {
    this.createChatUI()
  }

}