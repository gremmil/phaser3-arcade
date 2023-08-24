import Phaser from 'phaser'


export default class Scene_Sem2 extends Phaser.Scene {
    public background: Phaser.GameObjects.TileSprite;
    public flappy: Phaser.Physics.Arcade.Sprite;
    public button: Phaser.GameObjects.Sprite;
    public cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('scene_2');
    }

    preload() {
        //carg todos los recursos
        //this.stage.backgroundColor="#000";
        this.load.image('button', 'img/btn.png');
        this.load.image('background', 'img/bg.jpeg');
        this.load.spritesheet('flappy', 'img/pajaro.png', {
            frameWidth: 43,
            frameHeight: 30
        });
        //this.load.setBaseURL('https://labs.phaser.io');

    }

    create() {
        // mostrar pantalla
        this.background = this.add.tileSprite(0, 0, this.game.canvas.width * 2, this.game.canvas.height * 2, "background");
        this.flappy = this.physics.add.sprite(100, 100, 'flappy');
        this.flappy.setFrame(1);
        this.flappy.setCollideWorldBounds(true);
        this.anims.create({
            key: 'fly',
            frameRate: 7,
            frames: this.anims.generateFrameNumbers('flappy', { start: 0, end: 2 }),
            repeat: -1
        })
        this.flappy.play('fly');
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        //this.button = this.add.sprite(game.canvas.width/2, game.canvas.height/2, 'button');
        this.add.text(25,500, 'Autor: Miguel Angel Huanacchiri Castillo - U17100659', {
            wordWrap: {
                width: this.game.canvas.width - 50
            },
            color: "#000"
        });
    }

    update(time: number, delta: number): void {
    
        if (this.cursorKeys.down.isDown) {
            this.flappy.setScale(1, 1)
            this.flappy.setAngle(90);
            this.flappy.y++;
        }
        if (this.cursorKeys.up.isDown) {
            this.flappy.setScale(1, 1)
            this.flappy.setAngle(-90);
            this.flappy.y--;
        }
        if (this.cursorKeys.left.isDown) {
            this.background.tilePositionX -= 1;
            this.flappy.setScale(-1, 1)
            this.flappy.setAngle(0);
            this.flappy.x--;
        }
        if (this.cursorKeys.right.isDown) {
            this.background.tilePositionX += 1;
            this.flappy.setScale(1, 1)
            this.flappy.setAngle(0);
            this.flappy.x++;
        }
    }
}


