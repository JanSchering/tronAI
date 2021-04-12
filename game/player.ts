import * as React from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./literals";
import { getColorCode } from "./utils";
import { Direction, Color, Coordinate } from "./types";
import { throws } from "node:assert";

export type PlayerProps = {
  color: Color;
  coordinates: Coordinate;
  name: string;
};

export class Player {
  private color: Color = Color.BLUE;
  private coordinates: Coordinate;
  private name: string;
  private direction: Direction;
  private alive: boolean;

  constructor(props: PlayerProps) {
    this.color = props.color;
    this.coordinates = props.coordinates;
    this.name = props.name;
    this.direction = Direction.NONE;
    this.alive = true;
  }

  setColor(color: Color): void {
    this.color = color;
  }

  getColor(): Color {
    return this.color;
  }

  setCoordinates(coordinates: Coordinate) {
    this.coordinates = coordinates;
  }

  getCoordinates(): Coordinate {
    return this.coordinates;
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  getDirection(): Direction {
    return this.direction;
  }

  setAlive(alive: boolean): void {
    this.alive = alive;
  }

  getAlive(): boolean {
    return this.alive;
  }

  /**
   * @description Move the player one step in its current direction.
   * @param player
   * @param setCoordinates
   */
  move(): void {
    const { x, y } = this.coordinates;
    switch (this.direction) {
      case Direction.UP:
        this.coordinates = {
          ...this.coordinates,
          y: y - 5,
        };
        break;
      case Direction.DOWN:
        this.coordinates = {
          ...this.coordinates,
          y: y + 5,
        };
        break;
      case Direction.LEFT:
        this.coordinates = {
          ...this.coordinates,
          x: x - 5,
        };
        break;
      case Direction.RIGHT:
        this.coordinates = {
          ...this.coordinates,
          x: x + 5,
        };
        break;
      default:
        break;
    }
  }
}
