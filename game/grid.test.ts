import { Grid } from "./grid";
import * as tf from "@tensorflow/tfjs";

const NUM_ROWS = 3;
const NUM_COLS = 3;
const CELL_HEIGHT = 10;
const CELL_WIDTH = 10;

describe("Grid Class", () => {
  beforeAll(async () => {
    await tf.setBackend("cpu");
  });

  describe("instantiation", () => {
    it("instantiates properly", () => {
      const grid = new Grid({
        numRows: NUM_ROWS,
        numCols: NUM_COLS,
        cellHeight: CELL_HEIGHT,
        cellWidth: CELL_WIDTH,
      });

      expect(grid.numRows).toBe(NUM_ROWS);
      expect(grid.numCols).toBe(NUM_COLS);
      expect(grid.cellHeight).toBe(CELL_HEIGHT);
      expect(grid.cellWidth).toBe(CELL_WIDTH);
      //ensure that the actual grid representation is correct
      expect(grid.grid.shape).toStrictEqual([NUM_ROWS, NUM_COLS]);
    });
  });

  describe("setValue", () => {
    const grid = new Grid({
      numRows: NUM_ROWS,
      numCols: NUM_COLS,
      cellHeight: CELL_HEIGHT,
      cellWidth: CELL_WIDTH,
    });

    it("can set the value of specific Grid cells properly", () => {
      const colIdx = 1;
      const rowIdx = 2;

      expect(grid.grid.bufferSync().get(rowIdx, colIdx)).toBe(0);

      grid.setValue(1, { rowIdx, colIdx });

      expect(grid.grid.bufferSync().get(rowIdx, colIdx)).toBe(1);
    });
  });

  describe("getCoordsForCell", () => {
    const grid = new Grid({
      numRows: NUM_ROWS,
      numCols: NUM_COLS,
      cellHeight: CELL_HEIGHT,
      cellWidth: CELL_WIDTH,
    });

    it("returns the correct coordinates for a cell", () => {
      const colIdx = 2;
      const rowIdx = 1;

      // The x-coordinate should equal the amount of columns * the width per column
      const x = CELL_WIDTH * colIdx;
      // The y-coordinate should equal the amount of rows * the height per row
      const y = CELL_HEIGHT * rowIdx;

      expect(grid.getCoordsForCell({ rowIdx, colIdx })).toStrictEqual({ x, y });
    });
  });

  describe("isCellFilled", () => {
    const grid = new Grid({
      numRows: NUM_ROWS,
      numCols: NUM_COLS,
      cellHeight: CELL_HEIGHT,
      cellWidth: CELL_WIDTH,
    });

    it("determines correctly, whether or not a cell is filled", () => {
      const colIdx = 2;
      const rowIdx = 1;
      expect(grid.isCellFilled({ rowIdx, colIdx })).toBeFalsy();

      grid.setValue(1, { rowIdx, colIdx });

      expect(grid.isCellFilled({ rowIdx, colIdx })).toBeTruthy();
    });
  });

  describe("gridAsArray", () => {
    const grid = new Grid({
      numRows: NUM_ROWS,
      numCols: NUM_COLS,
      cellHeight: CELL_HEIGHT,
      cellWidth: CELL_WIDTH,
    });

    it("returns an array of correct length and with the correct content", () => {
      const colIdx = 2;
      const rowIdx = 1;

      let array = grid.gridAsArray;

      expect(array.length).toBe(NUM_ROWS * NUM_COLS);
      array.forEach((entry) => {
        expect(entry).toBe(0);
      });

      grid.setValue(1, { rowIdx, colIdx });

      array = grid.gridAsArray;

      expect(array.length).toBe(NUM_ROWS * NUM_COLS);
      const accessor = rowIdx * NUM_COLS + colIdx;
      expect(array[accessor]).toBe(1);
    });
  });
});
