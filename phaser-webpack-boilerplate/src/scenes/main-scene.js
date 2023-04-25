export default class GameScene extends Phaser.Scene {
  constructor(config) {
    console.log("This is the main game scene");
    super(config);
    this.config = config;
    this.tank = null;
  }

  preload() {
    //Carga assets
    this.load.image("sky", "assets/SpaceBackground.jpg");
    this.load.image("tank", "assets/Tank.png");
  }

  create() {
    //Cambia el pivote del cielo
    this.add.image(0, 0, "sky").setOrigin(0);

    //Tank
    this.tank = this.add.sprite(100, this.config.height, "tank");
    this.tank.setScale(0.1);
    this.tank.setOrigin(0.5, 1);
    this.physics.add.existing(this.tank);

    //Configuración de movimiento
    this.tank.body.velocity.x = 0;
    this.tank.body.allowGravity = false;

    //Configuración de colisiones
    this.tank.body.setCollideWorldBounds(true);

    //Configuración de controles
    const keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    const speed = 150;

    keys.left.on('down', () => {
      this.tank.body.velocity.x = -speed;
    });
    
    keys.right.on('down', () => {
      this.tank.body.velocity.x = speed;
    });
    
    keys.left.on('up', () => {
      this.tank.body.velocity.x = 0;
    });
    
    keys.right.on('up', () => {
      this.tank.body.velocity.x = 0;
    });
  }
}
