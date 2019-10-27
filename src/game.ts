import {MainScene} from './scenes/mainScene';

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  scene: [MainScene],
};

const game = new Phaser.Game(config);
