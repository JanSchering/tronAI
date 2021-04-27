import * as tf from "@tensorflow/tfjs";
import {
  healthCheckup,
  isNeon,
  keydownListener,
  reset,
  step,
} from "./environment";
import { Direction, GridCell, Standard_Color } from "./types";
import { Player } from "./player";
import { Grid } from "./grid";
import { NEON_RED, P1_STARTING_POS, P2_STARTING_POS } from "./literals";

tf.setBackend("cpu");

describe("Environment Functions", () => {
  let player1: Player;
  let player2: Player;
  let grid: Grid;

  beforeEach(() => {
    player1 = new Player({
      name: "p1",
      color: Standard_Color.BLUE,
      position: P1_STARTING_POS,
    });

    player2 = new Player({
      name: "p2",
      color: Standard_Color.RED,
      position: P2_STARTING_POS,
    });

    grid = new Grid({
      numRows: 100,
      numCols: 25,
      cellHeight: 10,
      cellWidth: 10,
    });
  });

  describe("isNeon", () => {
    it("recognizes when a color is not Neon", () => {
      expect(isNeon(Standard_Color.BLUE)).toBeFalsy();
    });

    it("recognizes when a color is Neon", () => {
      expect(isNeon(NEON_RED)).toBeTruthy();
    });
  });

  describe("keydownListener", () => {
    let handler: (event: KeyboardEvent) => void;

    beforeEach(() => {
      handler = keydownListener(player1, player2);
    });

    afterEach(() => {
      document.removeEventListener("keydown", handler);
    });

    it("processes input from the game keys for player 1", () => {
      expect(player1.direction).toBe(Direction.NONE);

      triggerKeydown("ArrowUp", 38);
      expect(player1.direction).toBe(Direction.UP);

      player1.direction = Direction.NONE;
      triggerKeydown("ArrowDown", 40);
      expect(player1.direction).toBe(Direction.DOWN);

      player1.direction = Direction.NONE;
      triggerKeydown("ArrowLeft", 37);
      expect(player1.direction).toBe(Direction.LEFT);

      player1.direction = Direction.NONE;
      triggerKeydown("ArrowRight", 39);
      expect(player1.direction).toBe(Direction.RIGHT);
    });

    it("does not change p1 direction when trying to go opposite form current", () => {
      triggerKeydown("ArrowUp", 38);
      expect(player1.direction).toBe(Direction.UP);

      triggerKeydown("ArrowDown", 40);
      expect(player1.direction).toBe(Direction.UP); // The direction should be unchanged

      player1.direction = Direction.DOWN;
      triggerKeydown("ArrowUp", 38);
      expect(player1.direction).toBe(Direction.DOWN);

      player1.direction = Direction.LEFT;
      triggerKeydown("ArrowRight", 39);
      expect(player1.direction).toBe(Direction.LEFT);

      player1.direction = Direction.RIGHT;
      triggerKeydown("ArrowLeft", 37);
      expect(player1.direction).toBe(Direction.RIGHT);
    });

    it("processes input from the game keys for player 2", () => {
      expect(player2.direction).toBe(Direction.NONE);

      triggerKeydown("KeyW", 87);
      expect(player2.direction).toBe(Direction.UP);

      player2.direction = Direction.NONE;
      triggerKeydown("KeyS", 83);
      expect(player2.direction).toBe(Direction.DOWN);

      player2.direction = Direction.NONE;
      triggerKeydown("KeyA", 65);
      expect(player2.direction).toBe(Direction.LEFT);

      player2.direction = Direction.NONE;
      triggerKeydown("KeyD", 68);
      expect(player2.direction).toBe(Direction.RIGHT);
    });

    it("does not change p2 direction when trying to go opposite form current", () => {
      triggerKeydown("KeyW", 87);
      expect(player2.direction).toBe(Direction.UP);

      triggerKeydown("KeyS", 83);
      expect(player2.direction).toBe(Direction.UP); // The direction should be unchanged

      player2.direction = Direction.DOWN;
      triggerKeydown("KeyW", 87);
      expect(player2.direction).toBe(Direction.DOWN);

      player2.direction = Direction.LEFT;
      triggerKeydown("KeyD", 68);
      expect(player2.direction).toBe(Direction.LEFT);

      player2.direction = Direction.RIGHT;
      triggerKeydown("KeyA", 65);
      expect(player2.direction).toBe(Direction.RIGHT);
    });

    it("returns no handler if event is composing or keyCode 229", () => {
      let test = triggerKeydown("something", 65, true);
      expect(test).toBeUndefined();
      test = triggerKeydown("something", 229);
      expect(test).toBeUndefined();
    });
  });

  describe("reset", () => {
    const testCanvas = document.createElement("canvas");
    const ctx = testCanvas.getContext("2d");
    it("resets the game environment to a starting state", () => {
      const rowIdx = 2;
      const colIdx = 1;
      grid.setValue(1, { rowIdx, colIdx });
      player1.direction = Direction.LEFT;
      player2.direction = Direction.RIGHT;
      player1.move();
      player2.move();

      reset(player1, player2, ctx, grid);

      expect(grid.isCellFilled({ rowIdx, colIdx })).toBeFalsy();
      expect(player1.direction).toBe(Direction.NONE);
      expect(player2.direction).toBe(Direction.NONE);
      expect(player1.position).toBe(P1_STARTING_POS);
      expect(player2.position).toBe(P2_STARTING_POS);
    });
  });

  describe("healthCheckup", () => {
    it("Indicates if the current position of a player is terminal, according to the current playfield", () => {
      expect(healthCheckup(player1, grid)).toBeTruthy();
      expect(player1.alive).toBeTruthy();

      const colIdx = 0;
      const rowIdx = 0;
      grid.setValue(1, { rowIdx, colIdx });
      player1.direction = Direction.LEFT;
      player1.position = { rowIdx, colIdx };

      expect(healthCheckup(player1, grid)).toBeFalsy();
      expect(player1.alive).toBeFalsy();
    });
  });

  describe("step", () => {
    it("moves the playfield one time-step forward (no directions set)", () => {
      step(player1, player2, grid);
      expect(player1.position).toBe(P1_STARTING_POS);
      expect(player2.position).toBe(P2_STARTING_POS);
      expect(player1.alive).toBeTruthy();
      expect(player2.alive).toBeTruthy();
      expect(grid.isCellFilled(player1.position)).toBeTruthy();
      expect(grid.isCellFilled(player2.position)).toBeTruthy();
    });
    it("moves the playfield one time-step forward (players have directions)", () => {
      player1.direction = Direction.RIGHT;
      player2.direction = Direction.LEFT;

      const p1NewPos: GridCell = {
        ...P1_STARTING_POS,
        colIdx: P1_STARTING_POS.colIdx + 1,
      };
      const p2NewPos: GridCell = {
        ...P2_STARTING_POS,
        colIdx: P2_STARTING_POS.colIdx - 1,
      };

      step(player1, player2, grid);

      expect(player1.position).toStrictEqual(p1NewPos);
      expect(player2.position).toStrictEqual(p2NewPos);
      expect(player1.alive).toBeTruthy();
      expect(player2.alive).toBeTruthy();
      expect(grid.isCellFilled(p1NewPos)).toBeTruthy();
      expect(grid.isCellFilled(p2NewPos)).toBeTruthy();
    });
  });
});

const triggerKeydown = (code: string, keyCode: number, isComposing = false) => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { code, keyCode, isComposing })
  );
};
