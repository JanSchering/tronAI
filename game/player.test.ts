import { Player } from "./player";
import * as Literals from "./literals";
import { Color, Direction } from "./types";

const STD_NAME = "test";
const STD_COLOR = Color.RED;
const STD_COORDS = {
  x: 20,
  y: 30,
};

describe("Player Class", () => {
  describe("instantiation", () => {
    it("instantiates properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        coordinates: STD_COORDS,
      });
      expect(newPlayer.getName()).toBe(STD_NAME);
      expect(newPlayer.getColor()).toBe(STD_COLOR);
      expect(newPlayer.getCoordinates()).toBe(STD_COORDS);
      //The constructor should set standard values
      //for the direction, the score and the alive status
      expect(newPlayer.getDirection()).toBe(Direction.NONE);
      expect(newPlayer.getAlive()).toBe(true);
    });
  });

  describe("movePlayer", () => {
    it("Doesn't Move when no direction is set", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        coordinates: STD_COORDS,
      });
      //Confirm initial position
      expect(newPlayer.getCoordinates()).toBe(STD_COORDS);

      newPlayer.move();

      //Confirm that the position did not change
      expect(newPlayer.getCoordinates()).toBe(STD_COORDS);
    });

    it("Direction == 'LEFT' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        coordinates: STD_COORDS,
      });
      //Confirm initial position
      expect(newPlayer.getCoordinates()).toBe(STD_COORDS);

      newPlayer.setDirection(Direction.LEFT); // Set the direction
      newPlayer.move();

      //Confirm that the position changed properly
      expect(newPlayer.getCoordinates()).toStrictEqual({
        x: STD_COORDS.x - 5,
        y: STD_COORDS.y,
      });
    });

    it("Direction == 'RIGHT' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        coordinates: STD_COORDS,
      });
      //Confirm initial position
      expect(newPlayer.getCoordinates()).toBe(STD_COORDS);

      newPlayer.setDirection(Direction.RIGHT); // Set the direction
      newPlayer.move();

      //Confirm that the position changed properly
      expect(newPlayer.getCoordinates()).toStrictEqual({
        x: STD_COORDS.x + 5,
        y: STD_COORDS.y,
      });
    });

    it("Direction == 'UP' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        coordinates: STD_COORDS,
      });
      //Confirm initial position
      expect(newPlayer.getCoordinates()).toBe(STD_COORDS);

      newPlayer.setDirection(Direction.UP); // Set the direction
      newPlayer.move();

      //Confirm that the position did not change
      expect(newPlayer.getCoordinates()).toStrictEqual({
        x: STD_COORDS.x,
        y: STD_COORDS.y - 5,
      });
    });

    it("Direction == 'DOWN' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        coordinates: STD_COORDS,
      });
      //Confirm initial position
      expect(newPlayer.getCoordinates()).toBe(STD_COORDS);

      newPlayer.setDirection(Direction.DOWN); // Set the direction
      newPlayer.move();

      //Confirm that the position did not change
      expect(newPlayer.getCoordinates()).toStrictEqual({
        x: STD_COORDS.x,
        y: STD_COORDS.y + 5,
      });
    });
  });
});
