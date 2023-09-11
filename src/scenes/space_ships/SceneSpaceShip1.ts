import Phaser from 'phaser'
export default class SceneSpaceShip1 extends Phaser.Scene {
  public background: Phaser.GameObjects.TileSprite;
  public ship: Phaser.Physics.Arcade.Sprite;
  public bullets: Phaser.GameObjects.Group;
  public enemies: Phaser.GameObjects.Group;
  public explosionSound: Phaser.Sound.BaseSound;
  public shotSound: Phaser.Sound.BaseSound;
  public lastFired: number = 0;
  public cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('scene_space_ship_1');
  }

  preload() {
    this.load.image('background', 'img/space.png');
    this.load.image('ship', 'img/nave.png');
    this.load.image('bullet', 'img/laser.png');
    this.load.image('enemy', 'img/pajaro2.png');
    this.load.audio("explosionSound", "audio/explosion_dull.mp3");
    this.load.audio("shotSound", "audio/laser_1.mp3");
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.game.canvas.width * 2, this.game.canvas.height * 2, "background");
    this.shotSound = this.sound.add("shotSound");
    this.explosionSound = this.sound.add("explosionSound");

    this.ship = this.physics.add.sprite(this.game.canvas.width / 2, 500, 'ship');
    this.ship.setOrigin(0.5);
    this.ship.setCollideWorldBounds(true);

    this.cursorKeys = this.input.keyboard.createCursorKeys();


    class Bullet extends Phaser.Physics.Arcade.Sprite {
      public speed;
      constructor(scene) {
        super(scene, 0, 0, 'bullet');
        this.speed = Phaser.Math.GetSpeed(400, 1);
      }

      fire(x, y) {
        this.setPosition(x, y - 50);
        this.setActive(true);
        this.setVisible(true);
      }

      update(time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -50) {
          this.setActive(false);
          this.setVisible(false);
          this.destroy();
        }

      }
    };
    class Hud extends Phaser.Scene {

    }

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 5,
      runChildUpdate: true,
    });

    this.enemies = this.physics.add.group({
      immovable: true,
      runChildUpdate: true,
    });

    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 7; x++) {
        const enemy: Phaser.Physics.Arcade.Sprite = this.enemies.create(x * 40 + 65, y * 20 + 50, 'enemy');
        enemy.setOrigin(0.5);
        enemy.setImmovable();
        this.physics.add.existing(enemy);
      }
    }

  };

  update(time: number, delta: number): void {
    if (this.cursorKeys.down.isDown) {
    }
    if (this.cursorKeys.up.isDown) {
    }
    if (this.cursorKeys.left.isDown) {
      this.ship.x -= 3;
    }
    if (this.cursorKeys.right.isDown) {
      this.ship.x += 3;
    }
    if (this.cursorKeys.space.isDown && time > this.lastFired) {
      const bullet = this.bullets.get();
      if (bullet) {
        this.shotSound.play();
        bullet.fire(this.ship.x, this.ship.y);
        this.lastFired = time + 50;
      }
    }
    this.physics.collide(this.bullets, this.enemies, (bullet, enemy) => {
      this.explosionSound.play();
      this.events.emit('addScore');
      bullet.destroy();
      enemy.destroy();
    })
  }
}


