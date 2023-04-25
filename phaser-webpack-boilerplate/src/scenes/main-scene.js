export default class GameScene extends Phaser.Scene {
  constructor(config) {
    console.log("This is the main game scene");
    super(config);
    this.config = config;
    this.tank = null;
    this.projectiles = null;
  }

  preload() {
    //Carga assets
    this.load.image("sky", "assets/SpaceBackground.jpg");
    this.load.image("tank", "assets/Tank.png");
    this.load.image("projectile", "assets/Projectile.png");
  }

  create() {
    //Cambia el pivote del cielo
    this.add.image(0, 0, "sky").setOrigin(0);

    //Tank
    this.tank = this.add.sprite(100, this.config.height - 50, "tank");
    this.tank.setScale(0.1);
    this.physics.add.existing(this.tank);

    //Configuración de movimiento
    this.tank.body.velocity.x = 0;
    this.tank.body.allowGravity = false;

    //Configuración de colisiones
    this.tank.body.setCollideWorldBounds(true);

    //Configuración de controles
    const cursors = this.input.keyboard.createCursorKeys();
    const speed = 150;

    cursors.left.on("down", () => {
      this.tank.body.velocity.x = -speed;
    });

    cursors.right.on("down", () => {
      this.tank.body.velocity.x = speed;
    });

    cursors.left.on("up", () => {
      this.tank.body.velocity.x = 0;
    });

    cursors.right.on("up", () => {
      this.tank.body.velocity.x = 0;
    });

    // Creación del grupo de proyectiles
    this.projectiles = this.physics.add.group({
      maxSize: 10,
      classType: Projectile,
    });

    //Configuración de disparo
    const spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    spacebar.on("down", () => {
      const projectile = this.projectiles.get();
      projectile.fire(this.tank.x, this.tank.y);
    });
  }

  update() {
    // Ocultar proyectiles al salir de la pantalla
    this.projectiles.getChildren().forEach((projectile) => {
      if (projectile.y < 0) {
        projectile.setVisible(false);
      }
    });
  }
}

class Projectile extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "projectile");
    this.speed = Phaser.Math.GetSpeed(600, 1);
  }

  fire(x, y) {
    this.setVisible(true);
    this.setActive(true);
    this.setPosition(x, y - 20);
  }

  update(time, delta) {
    this.y -= this.speed * delta;

    if (this.y < 0) {
      this.setVisible(false);
      this.setActive(false);
    }
  }
}
