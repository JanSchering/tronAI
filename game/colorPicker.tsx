import * as React from "react";
import { Color } from "./types";

export const ColorPicker = ({ color, callBack }: Props): React.ReactElement => {
  const [currentColor, setCurrentColor] = React.useState(color);

  const clickHandler = (color: Color) => {
    setCurrentColor(color);
    if (callBack) {
      callBack(color);
    }
  };

  return (
    <div className="colorPicker">
      <div
        className={`pickerChoice blue ${
          currentColor === Color.BLUE ? "picked" : ""
        }`}
        onClick={() => clickHandler(Color.BLUE)}
      ></div>
      <div
        className={`pickerChoice red ${
          currentColor === Color.RED ? "picked" : ""
        }`}
        onClick={() => clickHandler(Color.RED)}
      ></div>
      <div
        className={`pickerChoice green ${
          currentColor === Color.GREEN ? "picked" : ""
        }`}
        onClick={() => clickHandler(Color.GREEN)}
      ></div>
      <div
        className={`pickerChoice yellow ${
          currentColor === Color.YELLOW ? "picked" : ""
        }`}
        onClick={() => clickHandler(Color.YELLOW)}
      ></div>
    </div>
  );
};

type Props = {
  color: Color;
  callBack?: Function;
};
