import * as React from "react";

export const useCanvas = (
  callback: ([HTMLCanvasElement, CanvasRenderingContext2D]) => any
): React.RefObject<HTMLCanvasElement> => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    callback([canvas, ctx]);
  }, []);

  return canvasRef;
};

export const Canvas = React.memo(
  (props: Props): React.ReactElement => {
    const { canvasRef } = props;

    return (
      <canvas
        id="testCanvas"
        ref={canvasRef}
        width={1000}
        height={500}
        className="board"
      />
    );
  }
);

type Props = {
  width?: number;
  height?: number;
  className?: string;
  id?: string;
  canvasRef: React.RefObject<any>;
};
