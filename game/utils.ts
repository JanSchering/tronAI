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
