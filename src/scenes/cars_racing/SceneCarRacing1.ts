import Phaser from 'phaser'
export default class SceneCarRacing1 extends Phaser.Scene {
  public background: Phaser.GameObjects.TileSprite;
  public car: Player;
  public gasoline: Phaser.GameObjects.Group;
  public enemies: Phaser.GameObjects.Group;


  public carEnemySound: Phaser.Sound.BaseSound;
  public gasolineSound: Phaser.Sound.BaseSound;
  public backgroundSound: Phaser.Sound.BaseSound;


  public timerEvent: Phaser.Time.TimerEvent;
  public duration: number = 60;


  constructor() {
    super('scene_car_racing_1');
  }

  preload() {
    this.load.image('background', 'img/arcade/bg.png');
    this.load.image('car', 'img/arcade/carro.png');
    this.load.image('enemy', 'img/arcade/carroMalo.png');
    this.load.image('gasoline', 'img/arcade/gas.png');
    this.load.audio('backgroundSound', 'audio/arcade/background.wav');
    this.load.audio('carEnemySound', 'audio/arcade/car_explosion.mp3');
    this.load.audio('gasolineSound', 'audio/arcade/gas_explosion.mp3');
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.game.canvas.width * 2, this.game.canvas.height * 2, "background");
    this.backgroundSound = this.sound.add("backgroundSound", { loop: true, volume: 0.3 });
    this.backgroundSound.play();
    this.carEnemySound = this.sound.add("carEnemySound", { volume: 1 });
    this.gasolineSound = this.sound.add("gasolineSound", { volume: 1 });
    this.events.emit('updateTime', this.duration);

    this.car = new Player(this);

    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: 20,
      runChildUpdate: true,
    });
    this.gasoline = this.physics.add.group({
      classType: Gasoline,
      maxSize: 20,
      runChildUpdate: true,
    });
    this.time.addEvent({
      loop: true,
      delay: 1500,
      callback: () => {
        this.enemies.get();
      }
    })
    this.time.addEvent({
      loop: true,
      delay: 2000,
      callback: () => {
        this.gasoline.get();
      }
    })
    this.timerEvent = this.time.addEvent({
      loop: true,
      delay: 1000,
      callback: (val) => {
        this.duration--;
        this.events.emit('updateTime', this.duration);
      },

    });
    this.physics.add.overlap(this.gasoline, this.enemies, (gas, enemy) => {
      gas.destroy();
      this.gasoline.get()
    });
    this.physics.add.overlap(this.car, this.gasoline, (car, gasoline) => {
      this.events.emit('updateScore', -10);
      this.gasolineSound.play();
      gasoline.destroy();
    });
    this.physics.add.overlap(this.car, this.enemies, (car, enemy) => {
      this.events.emit('updateScore', -20);
      this.carEnemySound.play();
      enemy.destroy();
    });
  };

  update(time: number, delta: number): void {
    this.background.tilePositionY -= 3;

    if (this.duration === 0) {
      this.timerEvent.destroy();
    }
  }
}

class Player extends Phaser.Physics.Arcade.Sprite {
  public cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor(scene) {
    super(scene, scene.game.canvas.width / 2, 496, 'car');
   /*  scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.sys.arcadePhysics.world.enableBody(this, 0); */
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);


    this.scene.physics.enableUpdate();
    this.setOrigin(0.5);
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
  }

  protected preUpdate(time: number, delta: number): void {
    if (this.cursorKeys.down.isDown) {
    }
    if (this.cursorKeys.up.isDown) {
    }
    if (this.cursorKeys.left.isDown && this.x > 45) {
      this.x -= 3;
    }
    if (this.cursorKeys.right.isDown && this.x < 245) {
      this.x += 3;
    }
  }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
  public speed;
  constructor(scene) {
    super(scene, 0, 0, 'enemy');
    this.speed = Phaser.Math.GetSpeed(200, 1);
    this.setOrigin(0.5, 0.5);
    const positionX = (Math.floor(Math.random() * 3) + 1) * 73;
    this.setPosition(positionX, 0);
    this.setActive(true);
    this.setVisible(true);
  }

  update(time, delta) {
    this.y += this.speed * delta;
    if (this.y > this.scene.game.canvas.height) {
      this.eventNames()
      this.scene.events.emit('updateScore', 20);
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
};

class Gasoline extends Phaser.Physics.Arcade.Sprite {
  public speed;
  constructor(scene) {
    super(scene, 0, 0, 'gasoline');
    this.speed = Phaser.Math.GetSpeed(200, 1);
    this.setOrigin(0.5, 0.5);
    const positionX = (Math.floor(Math.random() * 3) + 1) * 73;
    this.setPosition(positionX, 0);
    this.setActive(true);
    this.setVisible(true);
  }

  update(time, delta) {
    this.y += this.speed * delta;
    if (this.y > this.scene.game.canvas.height) {
      this.scene.events.emit('updateScore', 10);
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
};