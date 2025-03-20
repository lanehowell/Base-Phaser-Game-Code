import { PreloadScene } from "./scenes/PreloadScene.js";
import { StartingMapScene } from "./scenes/StartingMapScene.js";

//Game Config
const config = {
    type: Phaser.CANVAS,
    width: '100%',
    height: '100%',
    parent: 'canvas',
    scene: [PreloadScene, StartingMapScene],
    scale: {
        mode: Phaser.Scale.RESIZE
    },
    render: {
        pixelArt: true,
        roundPixels: true
    }
}

//Create Game
const game = new Phaser.Game(config)

//Handle Window Resizing
window.addEventListener('resize', () => {
    game.canvas.height = window.innerHeight - 50
    game.canvas.width = window.innerWidth
});