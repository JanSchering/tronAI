import * as React from "react";
import { Color } from "./types";

export const ColorPicker = ({
  color,
  clickHandler,
}: Props): React.ReactElement => {
  return (
    <div className="colorPicker">
      <div
        className={`pickerChoice blue ${color === Color.BLUE ? "picked" : ""}`}
        onClick={() => clickHandler("blue")}
      ></div>
      <div
        className={`pickerChoice red ${color === Color.RED ? "picked" : ""}`}
        onClick={() => clickHandler("red")}
      ></div>
      <div
        className={`pickerChoice green ${
          color === Color.GREEN ? "picked" : ""
        }`}
        onClick={() => clickHandler("green")}
      ></div>
      <div
        className={`pickerChoice yellow ${
          color === Color.YELLOW ? "picked" : ""
        }`}
        onClick={() => clickHandler("yellow")}
      ></div>
    </div>
  );
};

type Props = {
  color: Color;
  clickHandler: Function;
};
