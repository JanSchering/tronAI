import { GridMetaData, GridCell, Coordinate } from "./types";

/**
 * @description Get Meta information about the grid that the players play on.
 * @param playerWidth
 * @param playerHeight
 * @param canvas
 * @returns
 */
export const getGridMetaData = (
  playerWidth: number,
  playerHeight: number,
  canvas: HTMLCanvasElement
): GridMetaData => {
  const totalHeight = canvas.height;
  const totalWidth = canvas.width;

  const numRows = Math.floor(totalHeight / playerHeight);
  const numCols = Math.floor(totalWidth / playerWidth);

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
    x: rowIdx * playerWidth,
    y: colIdx * playerHeight,
  };
};

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
