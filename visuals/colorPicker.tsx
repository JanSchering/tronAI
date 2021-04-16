import * as React from "react";
import { Color, Standard_Color } from "../game/types";

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
          currentColor === Standard_Color.BLUE ? "picked" : ""
        }`}
        onClick={() => clickHandler(Standard_Color.BLUE)}
      ></div>
      <div
        className={`pickerChoice red ${
          currentColor === Standard_Color.RED ? "picked" : ""
        }`}
        onClick={() => clickHandler(Standard_Color.RED)}
      ></div>
      <div
        className={`pickerChoice green ${
          currentColor === Standard_Color.GREEN ? "picked" : ""
        }`}
        onClick={() => clickHandler(Standard_Color.GREEN)}
      ></div>
      <div
        className={`pickerChoice yellow ${
          currentColor === Standard_Color.YELLOW ? "picked" : ""
        }`}
        onClick={() => clickHandler(Standard_Color.YELLOW)}
      ></div>
    </div>
  );
};

type Props = {
  color: Color;
  callBack?: Function;
};
