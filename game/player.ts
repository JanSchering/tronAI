import * as React from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./literals";
import { getColorCode } from "./utils";
import { Direction, Color, Coordinate, PlayerProps } from "./types";

export interface Player {
  color: Color;
  coordinates: Coordinate;
  name: string;
  direction: Direction;
  score: number;
  alive: boolean;
}

export const playerTest = (props: Props): PlayerUtilTuple => {
  const [player, setPlayer] = React.useState<Player>({
    color: props.color,
    coordinates: props.coordinates,
    name: props.name,
    direction: props.direction | Direction.NONE,
    score: props.score | 0,
    alive: true,
  });

  const setColor = (color) => {
    setPlayer({
      ...player,
      color,
    });
  };

  const setCoordinates = (coordinates) => {
    console.log("TESTSTTSSTSTSTSTSTST");
    console.log(player.direction);
    setPlayer({
      ...player,
      coordinates,
    });
  };

  const setName = (name) => {
    setPlayer({
      ...player,
      name,
    });
  };

  const setDirection = (direction) => {
    setPlayer({
      ...player,
      direction,
    });
  };

  const getDirection = () => {
    console.log(player);
    return player.direction;
  };

  const setScore = (score) => {
    setPlayer({
      ...player,
      score,
    });
  };

  const setAlive = (alive) => {
    setPlayer({
      ...player,
      alive,
    });
  };

  return [
    player,
    setColor,
    setCoordinates,
    setDirection,
    setScore,
    setAlive,
    setName,
    getDirection,
  ];
};

type Props = {
  color: Color;
  coordinates: Coordinate;
  name: string;
  direction?: Direction;
  score?: number;
};

type PlayerUtilTuple = [
  Player,
  (color: Color) => void,
  (coordinates: Coordinate) => void,
  (direction: Direction) => void,
  (score: number) => void,
  (alive: boolean) => void,
  (name: string) => void,
  () => Direction
];
