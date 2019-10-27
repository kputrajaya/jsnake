import 'phaser';

import { Coordinate, Direction } from './definitions';

export class Snake {
  public direction: Direction;
  public bodyCoords: Coordinate[];
  public foodCoord: Coordinate;
  public alive: boolean;

  private lastDirection: Direction;
  private boundary: Coordinate;
  private allCoords: Coordinate[];

  constructor(boundary: Coordinate) {
    this.direction = Direction.UP;
    this.bodyCoords = [
      {
        x: Math.floor(boundary.x / 2),
        y: Math.ceil(boundary.y / 2),
      },
      {
        x: Math.floor(boundary.x / 2),
        y: Math.floor(boundary.y / 2),
      },
    ];
    this.foodCoord = this.bodyCoords[0];
    this.alive = true;

    this.lastDirection = Direction.UP;
    this.boundary = boundary;
    this.allCoords = [];
    for (let i = 0; i < this.boundary.x; i++) {
      for (let j = 0; j < this.boundary.y; j++) {
        this.allCoords.push({x: i, y: j});
      }
    }

    this.resetFood();
  }

  public changeDirection(direction: Direction) {
    // Prevent opposites
    if (this.lastDirection + direction === 3) {
      return;
    }
    this.direction = direction;
  }

  public resetFood() {
    // Find unused coords
    const usedCoords = [...this.bodyCoords, this.foodCoord];
    const unusedCoords = this.coordsExclude(this.allCoords, usedCoords);

    // Choose random unused coord
    const randomIndex = Math.floor(Math.random() * unusedCoords.length);
    this.foodCoord = unusedCoords[randomIndex];
  }

  public tick() {
    if (!this.alive) {
      return;
    }

    // Determine next movement
    const last = this.bodyCoords[this.bodyCoords.length - 1];
    const next: Coordinate = {x: last.x, y: last.y};
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

    // Move snake's tail
    if (next.x !== this.foodCoord.x || next.y !== this.foodCoord.y) {
      this.bodyCoords.shift();
    // Find new position for food
    } else {
      this.resetFood();
    }
  }

  private coordsExclude(first: Coordinate[], second: Coordinate[]) {
    const secondSet = new Set(second.map((coord) => `${coord.x}-${coord.y}`));
    return first.filter((coord) => !secondSet.has(`${coord.x}-${coord.y}`));
  }
}
