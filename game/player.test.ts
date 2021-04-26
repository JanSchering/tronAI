import { Player } from "./player";
import { Standard_Color, Direction } from "./types";
import { P1_STARTING_POS, P2_STARTING_POS } from "./literals";

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

  describe("setters", () => {
    let newPlayer: Player;

    beforeEach(() => {
      newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
    });

    it("Can set the color", () => {
      expect(newPlayer.color).toBe(STD_COLOR);

      newPlayer.color = Standard_Color.GREEN;

      expect(newPlayer.color).toBe(Standard_Color.GREEN);
    });

    it("Can set the position", () => {
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.position = P2_STARTING_POS;

      expect(newPlayer.position).toBe(P2_STARTING_POS);
    });

    it("Can set the position", () => {
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.position = P2_STARTING_POS;

      expect(newPlayer.position).toBe(P2_STARTING_POS);
    });

    it("Can set the name", () => {
      expect(newPlayer.name).toBe(STD_NAME);

      const newName = "this is a new name";

      newPlayer.name = newName;

      expect(newPlayer.name).toBe(newName);
    });

    it("Can set the alive status", () => {
      expect(newPlayer.alive).toBe(true);

      newPlayer.alive = false;

      expect(newPlayer.alive).toBe(false);
    });
  });

  describe("movePlayer", () => {
    let newPlayer: Player;

    beforeEach(() => {
      newPlayer = new Player({
        name: STD_NAME,
        color: STD_COLOR,
        position: P1_STARTING_POS,
      });
    });

    it("Doesn't Move when no direction is set", () => {
      expect(newPlayer.position).toBe(P1_STARTING_POS);

      newPlayer.move();

      expect(newPlayer.position).toBe(P1_STARTING_POS);
    });

    it("Direction == 'LEFT' adjusts the position properly", () => {
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
