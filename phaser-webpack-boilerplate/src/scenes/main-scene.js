export default class GameScene extends Phaser.Scene {
  constructor(config) {
    super(config);
    this.config = config;
    this.enemySpeedIncrement = 10;
    this.currentWave = 1;
    this.enemySpeedMultiplier = 1;
    this.tank = null;
    this.projectiles = null;
    this.enemyProjectiles = null;
    this.enemies = null;
    this.enemyMovementTimer = null;
    this.tankSpeed = 200;
    this.enemySpeed = 20;
    this.enemyDelay = 1000;
    this.enemyPauseDuration = 500;
    this.enemyDirection = 1;
    this.enemyVerticalShift = 20;
    this.enemyHorizontalShift = 10;
    this.enemyProjectileSpeed = 300;
    this.gameOverTimer = null;
    this.gameOverText = null;
    this.restartCountdownTimer = null;
    this.restartCountdownText = null;
    this.restartDelay = 5000;
    this.score = 0; // Score variable
    this.scoreText = null; // Score text
  }

  preload() {
    this.load.image("sky", "assets/SpaceBackground.jpg");
    this.load.image("tank", "assets/Tank.png");
    this.load.image("projectile", "assets/Projectile.png");
    this.load.image("enemy", "assets/Enemy.png");
    this.load.image("enemyProjectile", "assets/EnemyProjectile.png");
    this.load.image("pauseButton", "assets/pause.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);

    this.scoreText = this.add.text(10, 10, "Score: 0", {
      fontSize: "24px",
      fill: "#fff",
    }); // Create score text

    this.tank = this.physics.add.sprite(this.config.width / 2, this.config.height - 50, "tank");
    this.tank.setScale(0.1);
    this.tank.body.allowGravity = false;
    this.tank.setCollideWorldBounds(true);

    this.projectiles = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.createEnemies();
    this.createKeyboardControls();
    this.startEnemyMovement();
    this.startEnemyShooting();

    this.physics.add.collider(this.projectiles, this.enemies, this.projectileHitEnemy, null, this);
    this.physics.add.collider(this.enemyProjectiles, this.tank, this.projectileHitTank, null, this);
    this.physics.add.collider(this.enemies, this.tank, this.enemyHitTank, null, this);

    // Agregar botón para iniciar el juego
    const startButton = this.add.text(this.config.width / 2, this.config.height / 2, "Empezar juego", {
      fontSize: "32px",
      fill: "#fff",
    })
      .setOrigin(0.5)
      .setInteractive();
    startButton.on("pointerup", this.startGame, this);
  }

  startGame() {
    // Eliminar el botón de inicio y comenzar el juego
    this.scene.start();
  }

pause() {
    this.physics.pause();
    this.isPaused = true;
    this.pauseButton.setVisible(false);
    //Toroshiro

    const continueButtonCallbacks = {
      onClick: this.resume,
      onMouseEnter: text => text.setFill("#0F0"),
      onMouseExit: text => text.setFill("#FFF"),
    };

    const quitButtonCallbacks = {
      onClick: this.quitGame,
      onMouseEnter: text => text.setFill("#F00"),
      onMouseExit: text => text.setFill("#FFF"),
    };

    const pauseMenu = {
      items: [
        { label: "Continue", style: { fontSize: "32px", fill: "#FFF" }, ...continueButtonCallbacks },
        { label: "Quit", style: { fontSize: "32px", fill: "#FFF" }, ...quitButtonCallbacks },
      ],
      firstItemPosition: { x: this.config.width / 2, y: this.config.height / 2 }, // Corregir aquí
      origin: { x: 0.5, y: 0.5 },
      spacing: 45
    };
    
    

    this.showMenu(pauseMenu);
  }

  resume() {
    this.physics.resume();
    this.isPaused = false;
    this.pauseButton.setVisible(true);
    this.hideMenu();

  }

  quitGame() {
    this.score = 0;
    this.scene.restart();
  

    

    //Toromal
}

showMenu(menu) {
  let yPos = menu.firstItemPosition.y;
  this.activeMenu = this.add.group();
  menu.items.forEach(item => {
      const textObject = this.add.text(menu.firstItemPosition.x, yPos, item.label, item.style)
      .setOrigin(menu.origin.x, menu.origin.y)
      .setInteractive();
      yPos += menu.spacing;
      textObject.on("pointerup", item.onClick, this)
      textObject.on("pointerover", ()=> {item.onMouseEnter(textObject)}, this);
      textObject.on("pointerover", ()=> {item.onMouseExit(textObject)}, this);
      this.activeMenu.add(textObject);
});
}

  createEnemies() {
    const enemyX = 100;
    const enemyY = 100;
    const enemySpacing = 80;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const enemy = this.physics.add.sprite(enemyX + i * enemySpacing, enemyY + j * enemySpacing, "enemy");
        enemy.setScale(0.05);
        enemy.body.allowGravity = false;
        enemy.setCollideWorldBounds(true);
        this.enemies.add(enemy);
      }
    }
  }

  checkEnemyWave() {
    if (this.enemies.countActive() === 0) {
      this.createNextWave();
      this.currentWave += 1;
      this.enemySpeedMultiplier += 0.8; // Incrementar el multiplicador de velocidad
    }
  }
  
  
  
  

  createNextWave() {
    const enemyX = 100;
    const enemyY = 100; // Cambiar las coordenadas de la siguiente oleada
    const enemySpacing = 80;
  
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        let enemy = this.physics.add.sprite(enemyX + i * enemySpacing, enemyY + j * enemySpacing, "enemy");
        enemy.setScale(0.05);
        enemy.body.allowGravity = false;
        enemy.setCollideWorldBounds(true);
        this.enemies.add(enemy);
      }
    }
  
    // Incrementar la velocidad de los enemigos por el multiplicador
    this.enemySpeed *= this.enemySpeedMultiplier;
  }
  
  
  

  createKeyboardControls() {
    const cursors = this.input.keyboard.createCursorKeys();

    cursors.left.on("down", () => {
      this.moveTankLeft();
    });

    cursors.right.on("down", () => {
      this.moveTankRight();
    });

    cursors.left.on("up", () => {
      if (!cursors.right.isDown) {
        this.stopTank();
      }
    });

    cursors.right.on("up", () => {
      if (!cursors.left.isDown) {
        this.stopTank();
      }
    });

    const spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    spacebar.on("down", () => {
      this.fireProjectile();
    });
  }

  moveTankLeft() {
    this.tank.body.velocity.x = -this.tankSpeed;
  }

  moveTankRight() {
    this.tank.body.velocity.x = this.tankSpeed;
  }

  stopTank() {
    this.tank.body.velocity.x = 0;
  }

  fireProjectile() {
    const projectile = this.physics.add.sprite(this.tank.x, this.tank.y - 20, "projectile");
    projectile.setScale(0.1);
    this.projectiles.add(projectile);
    projectile.body.velocity.y = -500;
    const randomEnemy = Phaser.Utils.Array.GetRandom(this.enemies.getChildren());
    //const enemyProjectile = this.physics.add.sprite(randomEnemy.x, randomEnemy.y + 20, "enemyProjectile");
    //enemyProjectile.setScale(0.1);
    //this.enemyProjectiles.add(enemyProjectile); // Add enemy projectile to the 'enemyProjectiles' group

    projectile.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", (body) => {
      if (body.gameObject === projectile && body.up) {
        projectile.destroy();
      }
    });
  }

  startEnemyMovement() {
    this.enemyMovementTimer = this.time.addEvent({
      delay: this.enemyDelay,
      loop: true,
      callback: () => {
        this.moveEnemies();
      },
    });
  }

  moveEnemies() {
    const enemyChildren = this.enemies.getChildren();
    let reachedRightEdge = false;
    let reachedLeftEdge = false;
    let reachedBottomEdge = false;

    for (let i = 0; i < enemyChildren.length; i++) {
      const enemy = enemyChildren[i];
      enemy.x += this.enemySpeed * this.enemyDirection;
    }

    for (let i = 0; i < enemyChildren.length; i++) {
      const enemy = enemyChildren[i];
      if (enemy.body.right >= this.config.width - this.enemyHorizontalShift) {
        reachedRightEdge = true;
      } else if (enemy.body.left <= this.enemyHorizontalShift) {
        reachedLeftEdge = true;
      }

      if (enemy.body.bottom >= this.config.height - this.enemyVerticalShift) {
        reachedBottomEdge = true;
      }
    }

    if (reachedRightEdge) {
      this.enemyDirection = -1;
      for (let i = 0; i < enemyChildren.length; i++) {
        const enemy = enemyChildren[i];
        enemy.y += this.enemyVerticalShift;
      }
    } else if (reachedLeftEdge) {
      this.enemyDirection = 1;
      for (let i = 0; i < enemyChildren.length; i++) {
        const enemy = enemyChildren[i];
        enemy.y += this.enemyVerticalShift;
      }
    }

    if (reachedBottomEdge) {
      this.enemyHitTank();
    }
  }

  startEnemyShooting() {
    this.time.addEvent({
      delay: Phaser.Math.Between(2000, 5000) / this.enemySpeedMultiplier, // Dividir el retraso por el multiplicador
      loop: true,
      callback: () => {
        this.enemyFireProjectile();
      },
    });
  }
  

  enemyFireProjectile() {
    if (this.enemies.getLength() === 0) {
      return; // No hay enemigos, salir de la función
    }
  
    const randomEnemy = Phaser.Utils.Array.GetRandom(this.enemies.getChildren());
    const enemyProjectile = this.physics.add.sprite(randomEnemy.x, randomEnemy.y + 20, "enemyProjectile");
    enemyProjectile.setScale(0.1);
    this.enemyProjectiles.add(enemyProjectile);
    enemyProjectile.body.velocity.y = this.enemyProjectileSpeed;
  
    this.physics.add.collider(enemyProjectile, this.tank, this.projectileHitTank, null, this);
  
  }

  projectileHitTank(projectile, tank) {
    projectile.destroy(); // Destroy the projectile
    tank.destroy(); // Destroy the tank/player
    this.gameOver(); // Trigger game over condition
  }

  projectileHitEnemy(projectile, enemy) {
    projectile.destroy();
    enemy.destroy();
    this.updateScore();
  
    this.checkEnemyWave(); // Verificar si es necesario crear la segunda oleada
  }
  

  enemyHitTank() {
    this.gameOver();
  }

  gameOver() {
    //this.scene.pause();
    
    this.restartCountdownText = this.add.text(this.config.width / 2, this.config.height / 2 + 50, "", {
      fontSize: "24px",
      fill: "#fff",
    }).setOrigin(0.5);

    

    this.gameOverTimer = this.time.delayedCall(this.restartDelay, () => {
      this.restartGame(); 
      console.log("a ver si si jala")
    });

    this.restartCountdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: 4,
      callback: () => {
        const remainingTime = 4 - this.restartCountdownTimer.repeatCount;
        this.restartCountdownText.setText(`El juego se reiniciará en ${remainingTime}...`);
      },
      onComplete: () => {
        this.restartCountdownText.setText("");
      },
    });
  }

  restartGame() {
    this.time.delayedCall(this.restartDelay, () => {
      this.scene.restart();
    });
  }
  

  updateScore() {
    if (!this.scoreText) {
      this.scoreText = this.add.text(10, 10, "Score: 0", {
        fontSize: "24px",
        fill: "#fff",
      });
      this.score = 0;
    }

    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
