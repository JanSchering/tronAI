/**
 * @description
 * @param {string} id - The ID of the canvas.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {Element} parentNode - The node to attach the canvas to.
 */
export const createCanvas = (id, width, height, parentNode, className) => {
  const gameCanvas = document.createElement("canvas");
  gameCanvas.id = id;
  gameCanvas.width = width;
  gameCanvas.height = height;
  gameCanvas.className = className;
  parentNode.appendChild(gameCanvas);
  return gameCanvas;
};
