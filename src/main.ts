import Phaser from "phaser";
import SceneCarRacing1 from "./scenes/cars_racing/SceneCarRacing1";
import Scene_Hud from "./Scene_Hud";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 290,//370
	height: 540,//550
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			checkCollision: {
				left: true,
				right: true,
				down: true,
				up: true
			}
		}

	},
	scene: [SceneCarRacing1, Scene_Hud ],
};

export const game = new Phaser.Game(config);
