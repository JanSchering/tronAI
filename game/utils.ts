/**
 * @description Helper-Function: Takes a numeric value for each the red, green and blue amount that we want
 * and returns the respective hexcode.
 */
function rgbToHex(r: number, g: number, b: number): string {
  if (r > 255 || g > 255 || b > 255)
    throw "Invalid color component, received color value >255";
  return ((r << 16) | (g << 8) | b).toString(16);
}

/**
 * @description Util-Function: Takes a numeric value for each the red, green and blue amount that we want
 * and returns the Color-Code.
 */
export function getColorCode(r: number, g: number, b: number): string {
  return "#" + ("000000" + rgbToHex(r, g, b)).slice(-6);
}

/**
 * @description Utility to draw a rectangle onto a canvas.
 * @param x - The x-coordinate to start the rectangle at (top left corner).
 * @param y - The y-coordinate to start the rectangle at (top left corner).
 * @param w - The width of the rectangle.
 * @param h - The height of the rectangle.
 * @param border - The border size.
 * @param ctx - The Canvas rendering context to use for drawing.
 */
export const drawRectangle = function (
  x: number,
  y: number,
  w: number,
  h: number,
  border: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(x + border, y);
  ctx.lineTo(x + w - border, y);
  ctx.quadraticCurveTo(x + w - border, y, x + w, y + border);
  ctx.lineTo(x + w, y + h - border);
  ctx.quadraticCurveTo(x + w, y + h - border, x + w - border, y + h);
  ctx.lineTo(x + border, y + h);
  ctx.quadraticCurveTo(x + border, y + h, x, y + h - border);
  ctx.lineTo(x, y + border);
  ctx.quadraticCurveTo(x, y + border, x + border, y);
  ctx.closePath();
  ctx.stroke();
};

/**
 * @description Utility to draw a neon square onto a canvas.
 * @param x - The x-coordinate to start drawing the neon square at (top left corner).
 * @param y - The y-coordinate to start drawing the neon square at (top left corner).
 * @param w - The width of the square.
 * @param h - The height of the square.
 * @param r - The amount of red in the square (between 0 and 255).
 * @param g - The amount of green in the square.
 * @param b - The amount of blue in the square.
 * @param ctx - The canvas rendering context.
 */
export const neonSquare = function (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  g: number,
  b: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.shadowColor = "rgb(" + r + "," + g + "," + b + ")";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ",0.2)";
  ctx.lineWidth = 7.5;
  //drawRectangle(x,y,w,h,1.5);
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ",0.2)";
  ctx.lineWidth = 6;
  drawRectangle(x, y, w, h, 1.5, ctx);
  ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ",0.2)";
  ctx.lineWidth = 4.5;
  drawRectangle(x, y, w, h, 1.5, ctx);
  ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ",0.2)";
  ctx.lineWidth = 3;
  drawRectangle(x, y, w, h, 1.5, ctx);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  drawRectangle(x, y, w, h, 1.5, ctx);
};
