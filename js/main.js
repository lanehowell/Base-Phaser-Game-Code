import networkService from "./gameServices/networkService.js";
import { PreloadScene } from "./scenes/PreloadScene.js";
import { StartingMapScene } from "./scenes/StartingMapScene.js";
import { UIScene } from "./scenes/UIScene.js";

//Initialize WebSocket Connection
networkService.connect();
setTimeout(init, 5000);
function init() {
    PreloadScene.map = networkService.map;
    //Game Config
    const config = {
        type: Phaser.AUTO,
        width: '100%',
        height: '100%',
        parent: 'canvas',
        scene: [new PreloadScene(networkService.map), StartingMapScene, UIScene],
        scale: {
            mode: Phaser.Scale.RESIZE
        },
        render: {
            pixelArt: true,
            roundPixels: true,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { x: 0, y: 0 },
                debug: false,
                fps: 60
            }
        }
    }
    
    //Create Game
    const game = new Phaser.Game(config)
    
    
    //Handle Window Resizing
    window.addEventListener('resize', () => {
        game.canvas.height = window.innerHeight - 50
        game.canvas.width = window.innerWidth
    });}

