import * as React from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./literals";
import { getColorCode } from "./utils";
import { Direction, Color, Coordinate, GridCell } from "./types";
import { throws } from "node:assert";

export type PlayerProps = {
  color: Color;
  position: GridCell;
  name: string;
};

export class Player {
  private _color: Color;
  private _position: GridCell;
  private _name: string;
  private _direction: Direction;
  private _alive: boolean;

  constructor(props: PlayerProps) {
    this._color = props.color;
    this._position = props.position;
    this._name = props.name;
    this._direction = Direction.NONE;
    this._alive = true;
  }

  public set color(color: Color) {
    this._color = color;
  }

  public get color(): Color {
    return this._color;
  }

  public set position(position: GridCell) {
    this._position = position;
  }

  public get position(): GridCell {
    return this._position;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public set direction(direction: Direction) {
    this._direction = direction;
  }

  public get direction(): Direction {
    return this._direction;
  }

  public set alive(alive: boolean) {
    this._alive = alive;
  }

  public get alive(): boolean {
    return this._alive;
  }

  /**
   * @description Move the player one step in its current direction.
   * @param player
   * @param setCoordinates
   */
  public move(): void {
    const { rowIdx, colIdx } = this._position;
    switch (this.direction) {
      case Direction.UP:
        this._position = {
          ...this._position,
          rowIdx: rowIdx - 1,
        };
        break;
      case Direction.DOWN:
        this._position = {
          ...this._position,
          rowIdx: rowIdx + 1,
        };
        break;
      case Direction.LEFT:
        this._position = {
          ...this._position,
          colIdx: colIdx - 1,
        };
        break;
      case Direction.RIGHT:
        this._position = {
          ...this._position,
          colIdx: colIdx + 1,
        };
        break;
      default:
        break;
    }
  }
}
