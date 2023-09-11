import Phaser from 'phaser'
import { SceneInfo } from '../../classes/SceneInfo.class';
import { AlertInfo } from '~/classes/AlertInfo';

export default class SceneSpaceInvaders extends Phaser.Scene {
  public background: Phaser.GameObjects.TileSprite;
  public player: Phaser.Physics.Arcade.Sprite;
  public bullets: Phaser.GameObjects.Group;
  public enemies: Phaser.GameObjects.Group;
  public explosionSound: Phaser.Sound.BaseSound;

  public shotSound: Phaser.Sound.BaseSound;
  public lastFired: number = 0;
  public timerEvent: Phaser.Time.TimerEvent;
  public sceneInfo: SceneInfo = new SceneInfo();
  public duration: number = 0;
  public score: number = 0;

  constructor() {
    super('scene_space_invaders');
  }

  preload() {
    this.load.image('background', 'img/space_invaders/background.png');
    this.load.image('player', 'img/space_invaders/player.png');
    this.load.image('bullet', 'img/laser.png');
    this.load.image('enemy_green', 'img/space_invaders/green.png');
    this.load.image('enemy_yellow', 'img/space_invaders/yellow.png');
    this.load.image('enemy_red', 'img/space_invaders/red.png');

    this.load.audio("explosionSound", "audio/space_invaders/invaderkilled.wav");
    this.load.audio("shotSound", "audio/space_invaders/shoot.wav");
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.game.canvas.width * 2, this.game.canvas.height * 2, "background");
    this.shotSound = this.sound.add("shotSound" , {volume: 0.7});
    this.explosionSound = this.sound.add("explosionSound" , {volume: 0.5});
    this.player = new Player(this, this.game.canvas.width / 2, 500, 'player');
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 5,
      runChildUpdate: true,
    });

    this.enemies = this.physics.add.group({
      immovable: true,
      runChildUpdate: true,
    });

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 7; x++) {
        let enemy: Phaser.Physics.Arcade.Sprite;
        if (y < 5 && y > 3) {
          enemy = this.enemies.create(x * 40 + 65, y * 20 + 50, 'enemy_green');
        }
        if (y < 4 && y > 1) {
          enemy = this.enemies.create(x * 40 + 65, y * 20 + 50, 'enemy_yellow');
        }
        if (y < 2 && y >= 0) {
          enemy = this.enemies.create(x * 40 + 65, y * 20 + 50, 'enemy_red');
        }
        enemy.setOrigin(0.5);
        enemy.setScale(0.5);
        enemy.setImmovable();
        this.physics.add.existing(enemy);
      }
    }
    this.timerEvent = this.time.addEvent({
      loop: true,
      delay: 1000,
      callback: (val) => {
        this.duration++;
        if (this.sceneInfo.duration >= this.duration) {
          const { duration, score, lvl } = this.sceneInfo;
          const sceneInfo: SceneInfo = { duration: duration - this.duration, score: score + this.score, lvl }
          this.events.emit('updateSceneInfo', sceneInfo);
        } else {
          this.scene.pause();
          const alertInfo: AlertInfo = {
            message: '¡Se acabo el tiempo! ¿Deseas Reiniciar?',
            action: 'restart'
          }
          this.events.emit('showAlert', alertInfo);
        }
      },
    });
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      this.score += 10;
      const { duration, score, lvl } = this.sceneInfo;
      const sceneInfo: SceneInfo = { duration: duration - this.duration, score: score + this.score, lvl }
      this.events.emit('updateSceneInfo', sceneInfo);
      this.explosionSound.play();
      enemy.destroy();
      bullet.destroy();
      if (this.enemies.getLength() == 0) {
        let alertInfo: AlertInfo;
        if (sceneInfo.lvl == 2) {
          alertInfo = {
            message: '¡Felicidades Ganaste! ¿Deseas Jugar de Nuevo?',
            action: 'reload'
          }
        } else {
          alertInfo = {
            message: '¡Bien Hecho! ¿Siguiente Nivel?',
            action: 'next'
          }
        }
        this.scene.pause();
        this.events.emit('showAlert', alertInfo);
      }
    });

    let sceneHud: Phaser.Scene = this.scene.get('scene_hud_custom');
    sceneHud.events.destroy();
    sceneHud.events.on('reload', (val: number) => {
      this.score = 0;
      this.duration = 0;
      this.updateSceneInfo(new SceneInfo());
      this.scene.restart();
    }, this);
    sceneHud.events.on('restart', (val: number) => {
      this.score = 0;
      this.duration = 0;
      this.updateSceneInfo(this.sceneInfo);
      this.scene.restart();
    }, this);
    sceneHud.events.on('resume', (val: number) => {
      this.scene.resume();
    }, this);
    sceneHud.events.on('next', (val: number) => {
      console.log('Next Level')
      this.score = 0;
      this.duration = 0;
      this.sceneInfo = {
        duration: 20,
        lvl: this.sceneInfo.lvl + 1,
        score: 0
      }
      this.updateSceneInfo(this.sceneInfo);
      this.scene.restart();
    }, this);

    const alertInfo: AlertInfo = {
      message: 'Objetivo: Consigue destruir a todos los enemigos antes que el tiempo se acabe.\n Muevete con la teclas direccionales, y dispara con la Barra Espaciadora',
      action: 'resume'
    }
    this.events.emit('showAlert', alertInfo);
    this.scene.pause();
  };

  update(time: number, delta: number): void {
    if ('cursorKeys' in this.player) {
      const cursorKeys = this.player.cursorKeys as Phaser.Types.Input.Keyboard.CursorKeys;
      if (cursorKeys?.space.isDown && time > this.lastFired) {
        const bullet = this.bullets.get();
        if (bullet) {
          this.shotSound.play();
          bullet.fire(this.player.x, this.player.y);
          this.lastFired = time + 50;
        }
      }
    }
  }

  updateSceneInfo(config: SceneInfo) {
    const { duration, score, lvl } = config;
    this.sceneInfo = {
      duration, score, lvl
    }
    this.events.emit('updateSceneInfo', this.sceneInfo);
  }
}
class Player extends Phaser.Physics.Arcade.Sprite {
  public cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor(scene, x: number, y: number, spriteReference: string) {
    super(scene, x, y, spriteReference);
    /*  scene.sys.displayList.add(this);
     scene.sys.updateList.add(this);
     scene.sys.arcadePhysics.world.enableBody(this, 0); */
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.enableUpdate();
    this.setOrigin(0.5);
    this.setScale(0.5);
    this.setCollideWorldBounds(true);
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
  }

  protected preUpdate(time: number, delta: number): void {
    if (this.cursorKeys.down.isDown) {
    }
    if (this.cursorKeys.up.isDown) {
    }
    if (this.cursorKeys.left.isDown) {
      this.x -= 3;
    }
    if (this.cursorKeys.right.isDown) {
      this.x += 3;
    }
  }
}

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
