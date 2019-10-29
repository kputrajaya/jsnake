import 'phaser';

import { Direction } from './enum';

export class Snake {
  public bodyCoords!: Phaser.Geom.Point[];
  public foodCoord!: Phaser.Geom.Point;
  public alive!: boolean;
  public speed!: number;

  private boundary: Phaser.Geom.Point;
  private allCoords: Phaser.Geom.Point[];
  private direction!: Direction;
  private lastDirection!: Direction;

  constructor(sizeX: number, sizeY: number) {
    // Initializations
    this.boundary = new Phaser.Geom.Point(sizeX, sizeY);
    this.allCoords = [];
    for (let i = 0; i < sizeX; i++) {
      for (let j = 0; j < sizeY; j++) {
        this.allCoords.push(new Phaser.Geom.Point(i, j));
      }
    }

    // Initialize game
    this.resetAll();
  }

  public resetAll() {
    this.bodyCoords = [
      new Phaser.Geom.Point(
        Math.floor(this.boundary.x / 2),
        Math.floor(this.boundary.y / 2)),
    ];
    this.foodCoord = this.bodyCoords[0];
    this.resetFood();

    this.alive = true;
    this.speed = 200;
    this.direction = Direction.UP;
    this.lastDirection = Direction.UP;
  }

  public resetFood() {
    // Find unused coords
    const usedCoords = [...this.bodyCoords, this.foodCoord];
    const unusedCoords = this.coordsExclude(this.allCoords, usedCoords);

    // Choose random unused coord
    const randomIndex = Math.floor(Math.random() * unusedCoords.length);
    this.foodCoord = unusedCoords[randomIndex];
  }

  public changeDirection(direction: Direction) {
    // Prevent opposites
    if (this.lastDirection + direction === 3) {
      return;
    }
    this.direction = direction;
  }

  public tick() {
    if (!this.alive) {
      return;
    }

    // Determine next movement
    const last = this.bodyCoords[this.bodyCoords.length - 1];
    const next = new Phaser.Geom.Point(last.x, last.y);
    switch (this.direction) {
      case Direction.UP:
        next.y = (next.y - 1 + this.boundary.y) % this.boundary.y;
        break;
      case Direction.RIGHT:
        next.x = (next.x + 1) % this.boundary.x;
        break;
      case Direction.DOWN:
        next.y = (next.y + 1) % this.boundary.y;
        break;
      case Direction.LEFT:
        next.x = (next.x - 1 + this.boundary.x) % this.boundary.x;
        break;
    }
    this.lastDirection = this.direction;

    // Ded
    const unobstructedBodyCoords = this.coordsExclude(this.bodyCoords, [next]);
    if (unobstructedBodyCoords.length < this.bodyCoords.length) {
      this.alive = false;
      return;
    }

    // Move snake's head
    this.bodyCoords.push(next);

    // Move snake's tail (don't elongate snake)
    if (next.x !== this.foodCoord.x || next.y !== this.foodCoord.y) {
      this.bodyCoords.shift();
    // Find new position for food and increase speed
    } else {
      this.resetFood();
      this.speed -= this.speed > 50 ? 5 : 0;
    }
  }

  private coordsExclude(first: Phaser.Geom.Point[], second: Phaser.Geom.Point[]) {
    const secondSet = new Set(second.map((coord) => `${coord.x}-${coord.y}`));
    return first.filter((coord) => !secondSet.has(`${coord.x}-${coord.y}`));
  }
}
