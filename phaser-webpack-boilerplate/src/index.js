import Phaser, { Scenes } from "phaser";
import GameScene from "./scenes/main-scene";

const GLOBAL_CONFIG = {
  width: 800,
  height: 600,
}

const config = {
  type: Phaser.AUTO,
  ...GLOBAL_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {y: 400}
    }
  },
  scene: [new GameScene(GLOBAL_CONFIG)]
}
new Phaser.Game(config);