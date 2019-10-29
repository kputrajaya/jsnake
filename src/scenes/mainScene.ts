import { remote } from 'electron';
import 'phaser';

import { Direction } from '../models/enum';
import { Snake } from '../models/snake';

export class MainScene extends Phaser.Scene {
  private sizeX: number;
  private sizeY: number;
  private snake: Snake;
  private nextRun: number;

  private graphics!: Phaser.GameObjects.Graphics;
  private gridWidth!: number;
  private gridHeight!: number;

  constructor() {
    super({key: 'MainScene'});

    // Initialize grid parameters
    const centerX = 7;
    const centerY = 7;
    this.sizeX = centerX * 2 + 1;
    this.sizeY = centerY * 2 + 1;

    // Initialize snake
    this.snake = new Snake(this.sizeX, this.sizeY);
    this.nextRun = 0;
  }

  public create() {
    // Rendering
    this.cameras.main.setBackgroundColor(0X173F5F);
    const { width, height } = this.sys.game.canvas;
    this.gridWidth = width / this.sizeX;
    this.gridHeight = height / this.sizeY;
    this.graphics = this.add.graphics({x: 0, y: 0});

    // Keyboard events
    this.input.keyboard
      .on('keydown-UP', () => this.snake.changeDirection(Direction.UP));
    this.input.keyboard
      .on('keydown-RIGHT', () => this.snake.changeDirection(Direction.RIGHT));
    this.input.keyboard
      .on('keydown-DOWN', () => this.snake.changeDirection(Direction.DOWN));
    this.input.keyboard
      .on('keydown-LEFT', () => this.snake.changeDirection(Direction.LEFT));
  }

  public update(time: number) {
    // Run every second
    if (this.nextRun > time) {
      return;
    }

    if (!this.snake.alive) {
      remote.dialog.showMessageBox({
        message: 'You lose!',
        detail: `Your snake was ${this.snake.bodyCoords.length}-block long.`,
      },
      () => this.snake.resetAll());
      return;
    }

    // Tick
    this.snake.tick();
    this.nextRun = time + this.snake.speed;
    this.graphics.clear();

    // Draw snake body
    this.graphics.fillStyle(0x3CAEA3, 1.0);
    this.snake.bodyCoords.forEach((coord) => {
      this.graphics.fillRect(
        coord.x * this.gridWidth,
        coord.y * this.gridHeight,
        this.gridWidth,
        this.gridHeight,
      );
    });

    // Draw food
    this.graphics.fillStyle(0xED553B, 1.0);
    this.graphics.fillRect(
      this.snake.foodCoord.x * this.gridWidth,
      this.snake.foodCoord.y * this.gridHeight,
      this.gridWidth,
      this.gridHeight,
    );
  }
}
