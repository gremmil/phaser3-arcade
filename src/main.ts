import Phaser from "phaser";
import Scene_Sem2 from "./Scene_Sem2";
import Scene_Sem3 from "./Scene_Sem3";
import Scene_Hud from "./Scene_Hud";


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 370,
	height: 550,
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
	scene: [Scene_Sem3, Scene_Hud ],
};

export const game = new Phaser.Game(config);