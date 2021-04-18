import { GridMetaData, GridCell, Coordinate } from "./types";

/**
 * @description Get Meta information about the grid that the players play on.
 * @param playerWidth
 * @param playerHeight
 * @param canvasWidth
 * @param canvasHeight
 * @returns
 */
export const getGridMetaData = (
  playerWidth: number,
  playerHeight: number,
  canvasWidth: number,
  canvasHeight: number
): GridMetaData => {
  const numRows = Math.floor(canvasHeight / playerHeight);
  const numCols = Math.floor(canvasWidth / playerWidth);

  return {
    numCols,
    numRows,
    playerHeight,
    playerWidth,
  };
};

/**
 * @description Returns the (x,y) coordinates of the Top-Left corner of the provided grid cell.
 * @param gridInfo - Meta Data of the grid.
 * @param cell - The cell to get the coordinates for
 */
export const getCoordsFromGridPos = (
  gridInfo: GridMetaData,
  cell: GridCell
): Coordinate => {
  const { playerWidth, playerHeight } = gridInfo;
  const { colIdx, rowIdx } = cell;
  return {
    x: colIdx * playerWidth,
    y: rowIdx * playerHeight,
  };
};

/**
 * @description Creates a unique identifier for a cell.
 * @param cell
 * @returns
 */
export const getUniqueCellId = (cell: GridCell): string => {
  return String.fromCharCode(97 + cell.rowIdx) + cell.colIdx.toString();
};

//TODO: The implementation of this method currently does not work as intended.
/**
 * @description Check if a grid Cell is filled with color or empty.
 * @param cell - The cell to check.
 * @param gridInfo - Metadata about the grid.
 * @param ctx - Canvas Rendering Context.
 */
export const isCellFilled = (
  cell: GridCell,
  gridInfo: GridMetaData,
  ctx: CanvasRenderingContext2D
): boolean => {
  const coords = getCoordsFromGridPos(gridInfo, cell);
  const { x, y } = coords;
  const imgData = ctx.getImageData(x, y, 1, 1).data;
  return imgData[0] > 0 || imgData[1] > 0 || imgData[2] > 0;
};
