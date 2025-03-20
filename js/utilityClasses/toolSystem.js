export class ToolSystem {
    constructor(scene) {
        this.scene = scene,
            this.selectedTool = null,
            this.tools = {
                shovel: {
                    name: 'shovel',
                    tileIndex: 476,
                    use: (x, y) => this.useShovel(x, y)
                }
            }

        this.initializeInput()
    }

    initializeInput() {
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && this.selectedTool) {
                const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)

                const tileX = this.scene.map.worldToTileX(worldPoint.x)
                const tileY = this.scene.map.worldToTileY(worldPoint.y)

                this.tools[this.selectedTool].use(tileX, tileY)
            }
        })

        this.scene.input.keyboard.on('keydown-ONE', () => {
            this.selectTool('shovel');
        });

        // Add key to deselect tools (for example, 'ESC')
        this.scene.input.keyboard.on('keydown-ESC', () => {
            this.deselectTool();
        });
    }

    selectTool(toolName) {
        if (this.tools[toolName]) {
            this.selectedTool = toolName
            console.log(`Selected tool: ${toolName}`)
        }
    }

    deselectTool() {
        this.selectedTool = null
        console.log('Tool deselected')
    }

    useShovel(tileX, tileY) {
        const groundLayer = this.scene.map.getLayer('Ground Layer').tilemapLayer

        if (groundLayer) {
            groundLayer.putTileAt(this.tools.shovel.tileIndex, tileX, tileY)
        }
    }

    getToolStatus() {
        return this.selectedTool ? this.tools[this.selectedTool].name : 'None'
    }
}