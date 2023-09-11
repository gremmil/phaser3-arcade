import Phaser from "phaser";
import SceneSpaceInvaders from "./scenes/space_invaders/SceneSpaceInvaders";
import SceneHudCustom from "./scenes/space_invaders/SceneHudCustom";


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 370,//290
	height: 550,//540
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
	scene: [SceneSpaceInvaders, SceneHudCustom ],
};

export const game = new Phaser.Game(config);