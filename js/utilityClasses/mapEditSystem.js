export class MapEditSystem {
    constructor(scene){
        this.scene = scene
        this.tileIndex = 396

        this.initializeInput()
    }

    initializeInput() {

        this.scene.input.mouse.disableContextMenu()

        this.scene.input.on('pointerdown', (pointer)=>{
            if(pointer.rightButtonDown()){
                const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
                const tileX = this.scene.map.worldToTileX(worldPoint.x)
                const tileY = this.scene.map.worldToTileY(worldPoint.y)

                this.changeTile(tileX, tileY)
            }
        })

    }

    changeTile(x, y) {

        const pathsLayer = this.scene.paths_layer

        pathsLayer.putTileAt(this.tileIndex, x, y)

    }
}