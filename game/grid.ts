import { GridCell, Coordinate } from "./types";
import * as tf from "@tensorflow/tfjs";

export class Grid {
  private _numRows: number;
  private _numCols: number;
  private _cellWidth: number;
  private _cellHeight: number;
  private _grid: tf.Tensor2D;

  constructor(props: GridProps) {
    this._numRows = props.numRows;
    this._numCols = props.numCols;
    this._cellHeight = props.cellHeight;
    this._cellWidth = props.cellWidth;
    this._grid = tf.zeros([props.numRows, props.numCols]);
  }

  public get numRows() {
    return this._numRows;
  }

  public get numCols() {
    return this._numCols;
  }

  public get cellHeight() {
    return this._cellHeight;
  }

  public get cellWidth() {
    return this._cellWidth;
  }

  public get grid() {
    return this._grid;
  }

  /**
   * @description Set the value of a cell.
   * @param value - The value to set.
   * @param rowIdx - Row the cell is in.
   * @param colIdx - Column the cell is in.
   */
  public setValue(value: number, rowIdx: number, colIdx: number): void {
    this._grid.bufferSync().set(value, rowIdx, colIdx);
  }

  /**
   * @description Get the corresponding coordinates to a grid cell.
   * @param cell - The cell to get coordinates for
   * @returns the Coordinates of the top left corner of the cell.
   */
  public getCoordsForCell(cell: GridCell): Coordinate {
    const { colIdx, rowIdx } = cell;

    return {
      x: colIdx * this._cellWidth,
      y: rowIdx * this._cellHeight,
    };
  }

  public isCellFilled(cell: GridCell): boolean {
    return this._grid.bufferSync().get(cell.rowIdx, cell.colIdx) === 1;
  }
}

type GridProps = {
  numRows: number;
  numCols: number;
  cellWidth: number;
  cellHeight: number;
};
