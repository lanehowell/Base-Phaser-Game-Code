import { MAP_KEYS } from "../../assets/maps/mapKeys.js";
import { TILESET_KEYS } from "../../assets/maps/tilesets/tilesetKeys.js";
import { SCENE_KEYS } from "./SceneKeys.js";
import playerDataService from "../gameServices/playerDataService.js";
import { BaseScene } from "./baseScene.js";
import { MapEditSystem } from "../utilityClasses/mapEditSystem.js";
import networkService from "../gameServices/networkService.js";

export class StartingMapScene extends BaseScene {
    constructor() {
        super({
            key: SCENE_KEYS.STARTING_MAP_SCENE
        })

    }

    init(data) {
        this.mapId = data.mapId

        playerDataService.events.on('skillLevelUp', this.handleSkillLevelUp, this)
        // playerDataService.events.on('inventoryChanged', this.updateInventoryUI, this)

        networkService.events.on('mapChanged', this.handleMapChange, this)
    }

    handleMapChange(mapData) {

        console.log("Map change: New Map: ", mapData)
        this.cleanupScene()
        this.scene.restart({ mapId: SCENE_KEYS.STARTING_MAP_SCENE })

    }

    cleanupScene() {

        this.player.destroy()

        this.cleanupNetworkPlayers()

        this.networkPlayerManager.cleanup()

        playerDataService.events.off('skillLevelUp', this.handleSkillLevelUp, this)
        networkService.events.off('mapChanged', this.handleMapChange, this)

    }

    handleSkillLevelUp(data) {
        // Show level up notification
        this.showNotification(`${data.skill} increased to level ${data.level}!`);
    }

    showNotification(message) {
        console.log(message)
    }

    create() {

        this.scene.launch(SCENE_KEYS.UI_SCENE)

        this.input.mouse.disableContextMenu()
        this.createMap()

        this.createPlayer(MAP_KEYS.STARTING_MAP)
        this.setupNetworkPlayerManager() // Base Scene

        this.mapEditSystem = new MapEditSystem(this)

        this.createCamera()
        // this.handleClicks()
        this.handleZoom()
        this.movementSpeed = 100

        window.addEventListener('resize', () => {
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.centerOn(this.player.getSprite().x, this.player.getSprite().y)
        })

    }

    update() {

        if (this.player) {
            this.player.update()
        }

        if (this.networkPlayerManager) {
            this.networkPlayerManager.update()
        }

    }

    createMap() {

        // Load Tilemap
        this.map = this.make.tilemap({ key: MAP_KEYS.STARTING_MAP, tileHeight: 16, tileWidth: 16 });

        const beach_tiles = this.map.addTilesetImage('beach_tiles', TILESET_KEYS.BEACH_TILESET)
        const water_layer = this.map.createLayer('Water Layer', beach_tiles, 0, 0)
        this.ground_layer = this.map.createLayer('Ground Layer', beach_tiles, 0, 0)
        this.ground_layer.setInteractive()
        this.paths_layer = this.map.createLayer('Paths Layer', beach_tiles, 0, 0)
        this.paths_layer.setInteractive()

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
        //Set up portals
        this.portals = this.physics.add.group({ immovable: true })
        this.portalObjects = this.map.getObjectLayer('Portals').objects
        this.portalObjects.forEach((portalObject) => {
            console.log(portalObject)
            const portal = this.physics.add.sprite(
                portalObject.x + (portalObject.width / 2),
                portalObject.y + (portalObject.height / 2),
                null
            )
            portal.setSize(portalObject.width, portalObject.height)
            portal.setVisible(true)
            portal.setName(portalObject.name)
            portal.setImmovable(true)
            this.portals.add(portal)
        })
    }

    createCamera() {

        this.cameraZoom = 2
        this.cameraMinZoom = 1.5
        this.cameraMaxZoom = 4

        this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1)
        this.cameras.main.roundPixels = true
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.setZoom(this.cameraZoom)
        this.targetPosition = new Phaser.Math.Vector2()
        this.cameraSmoothing = 0.08

    }

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

    shutdown() {
        this.cleanupNetworkCollisions()
        playerDataService.events.off('skillLevelUp', this.handleSkillLevelUp, this);
    }
}
