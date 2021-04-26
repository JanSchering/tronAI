import { Player } from "./player";
import * as Literals from "./literals";
import { Standard_Color, Direction } from "./types";
import { P1_STARTING_POS } from "./literals";

const STD_NAME = "test";
const STD_COLOR = Standard_Color.RED;

describe("Player Class", () => {
  describe("instantiation", () => {
    it("instantiates properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
      expect(newPlayer.name).toBe(STD_NAME);
      expect(newPlayer.color).toBe(STD_COLOR);
      expect(newPlayer.position).toBe(P1_STARTING_POS);
      //The constructor should set standard values
      //for the direction, the score and the alive status
      expect(newPlayer.direction).toBe(Direction.NONE);
      expect(newPlayer.alive).toBe(true);
    });
  });

  describe("movePlayer", () => {
    it("Doesn't Move when no direction is set", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
      //Confirm initial position
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.move();

      //Confirm that the position did not change
      expect(newPlayer.position).toBe(P1_STARTING_POS);
    });

    it("Direction == 'LEFT' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
      //Confirm initial position
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.direction = Direction.LEFT; // Set the direction
      newPlayer.move();

      //Confirm that the position changed properly
      expect(newPlayer.position).toStrictEqual({
        colIdx: P1_STARTING_POS.colIdx - 1,
        rowIdx: P1_STARTING_POS.rowIdx,
      });
    });

    it("Direction == 'RIGHT' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
      //Confirm initial position
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.direction = Direction.RIGHT; // Set the direction
      newPlayer.move();

      //Confirm that the position changed properly
      expect(newPlayer.position).toStrictEqual({
        colIdx: P1_STARTING_POS.colIdx + 1,
        rowIdx: P1_STARTING_POS.rowIdx,
      });
    });

    it("Direction == 'UP' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
      //Confirm initial position
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.direction = Direction.UP; // Set the direction
      newPlayer.move();

      //Confirm that the position did not change
      expect(newPlayer.position).toStrictEqual({
        colIdx: P1_STARTING_POS.colIdx,
        rowIdx: P1_STARTING_POS.rowIdx - 1,
      });
    });

    it("Direction == 'DOWN' adjusts the position properly", () => {
      const newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
      //Confirm initial position
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.direction = Direction.DOWN; // Set the direction
      newPlayer.move();

      //Confirm that the position did not change
      expect(newPlayer.position).toStrictEqual({
        colIdx: P1_STARTING_POS.colIdx,
        rowIdx: P1_STARTING_POS.rowIdx + 1,
      });
    });
  });
});
