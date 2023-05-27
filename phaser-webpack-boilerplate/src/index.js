import Phaser, {scenes} from "phaser";
import GameScene from "./scenes/main-scene";

const GLOBAL_CONFIG = {
    width: 800,
    height: 600,
  }
  
  const config = {
    type: Phaser.AUTO,
    ...GLOBAL_CONFIG,
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
        gravity: {y: 0}
      }
    },
    scene: [new GameScene(GLOBAL_CONFIG)]
  }
  new Phaser.Game(config);