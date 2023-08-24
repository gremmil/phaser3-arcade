import { RestartButton } from "./components/restart-button";

export class Scene_Home extends Phaser.Scene {
  restartButton: RestartButton;
  public background: Phaser.GameObjects.TileSprite;
  constructor() {
    super({ key: 'home_scene' });
    this.restartButton = new RestartButton(this);
  }

  preload() {
    this.load.image('background', 'img/background.png');
    this.restartButton.preload();
  }
  
  create() {
    this.add.image(410, 250, 'background');
    this.restartButton.create();
    this.background = this.add.tileSprite(0, 0, this.game.canvas.width * 2, this.game.canvas.height * 2, "background");
  }
}