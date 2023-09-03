export default class Scene_Hud extends Phaser.Scene {
  public score: integer;
  public infoScore: Phaser.GameObjects.Text;
  public infoTime: Phaser.GameObjects.Text;
  public infoAuthor: Phaser.GameObjects.Text
  public timerEvent: Phaser.Time.TimerEvent;
  public duration: number = 0;
  constructor() {
    super({ key: 'scene_hud', active: true });

    this.score = 0;
  }

  create() {
    //  Our Text object to display the Score
    this.infoScore = this.add.text(10, 10, 'Score: 0', { font: '16px Arial', color: '#fff' });
    this.infoTime = this.add.text(this.game.canvas.width - 75, 10, 'Time: 0', { font: '16px Arial', color: '#fff', wordWrap: { width: 100 } });
    this.infoAuthor = this.add.text(10, this.game.canvas.height -20, 'AUTHOR: MIGUEL ANGEL HUANACCHIR CASTILLO U17100659', { font: '12px Arial', color: '#fff'});
    //  Grab a reference to the Game Scene
    let scene3: Phaser.Scene = this.scene.get('scene_3');

    //  Listen for events from it
    scene3.events.on('addScore', function () {

      this.score += 10;
      this.infoScore.setText('Score: ' + this.score);

    }, this);
    this.duration = 60000;
    this.stopTimer();
    this.timerEvent = this.time.addEvent({
      delay: this.duration,
      callback: () => {
        this.stopTimer();
      }
    })
  }

  update(time: number, delta: number): void {
    //this.infoTime.setText('Time: ' + Math.round(time/1000));
    if (this.timerEvent || this.duration <= 0) {
      console.log('Hola')
      const elapsed = this.timerEvent.getElapsed();
      const remaining = this.duration - elapsed;
      const seconds = (remaining / 1000).toFixed(0);
      this.infoTime.setText('Time: ' + seconds);
      console.log(remaining)
      if (Number(seconds) <= 0) {
        this.scene.pause('scene_3');
      }
    }
  }

  stopTimer() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }
  }
}