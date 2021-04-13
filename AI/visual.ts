/**
 * @description
 * @param id - The ID of the canvas.
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param parentNode - The node to attach the canvas to.
 * @param className - The className to give the canvas.
 */
export const createCanvas = (
  id: string,
  width: number,
  height: number,
  parentNode: Element,
  className: string
) => {
  const gameCanvas = document.createElement("canvas");
  gameCanvas.id = id;
  gameCanvas.width = width;
  gameCanvas.height = height;
  gameCanvas.className = className;
  parentNode.appendChild(gameCanvas);
  return gameCanvas;
};
