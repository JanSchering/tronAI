import * as React from "react";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import styles from "../style/app.module.scss";

import { Color, Standard_Color } from "../game/types";
import { NEON_RED, NEON_BLUE, NEON_GREEN, NEON_YELLOW } from "../game/literals";

import Neon_Blue_Img from "./images/neon_blue.png";
import Neon_Red_Img from "./images/neon_red.png";
import Neon_Green_Img from "./images/neon_green.png";
import Neon_Yellow_Img from "./images/neon_yellow.png";
import Std_Blue_Img from "./images/standard_blue.jpeg";
import Std_Red_Img from "./images/standard_red.jpg";
import Std_Green_Img from "./images/standard_green.jpeg";
import Std_Yellow_Img from "./images/standard_yellow.jpeg";

export const ColorPicker = ({ color, callBack }: Props): React.ReactElement => {
  const [currentColor, setCurrentColor] = React.useState(color);

  const clickHandler = (color: Color) => {
    setCurrentColor(color);
    if (callBack) {
      callBack(color);
    }
  };

  const colorCardBody = (entries: ColorCardEntry[]) => (
    <Card.Body>
      {entries.map((entry) => (
        <Image
          src={entry.src}
          style={{ width: "4rem" }}
          className={styles.sep_xs}
          onClick={entry.clickCallback}
        />
      ))}
    </Card.Body>
  );

  const NeonCardBody = colorCardBody([
    {
      src: Neon_Blue_Img,
      clickCallback: () => clickHandler(NEON_BLUE),
    },
    {
      src: Neon_Red_Img,
      clickCallback: () => clickHandler(NEON_RED),
    },
    {
      src: Neon_Green_Img,
      clickCallback: () => clickHandler(NEON_GREEN),
    },
    {
      src: Neon_Yellow_Img,
      clickCallback: () => clickHandler(NEON_YELLOW),
    },
  ]);

  const StdCardBody = colorCardBody([
    {
      src: Std_Blue_Img,
      clickCallback: () => clickHandler(Standard_Color.BLUE),
    },
    {
      src: Std_Red_Img,
      clickCallback: () => clickHandler(Standard_Color.RED),
    },
    {
      src: Std_Green_Img,
      clickCallback: () => clickHandler(Standard_Color.GREEN),
    },
    {
      src: Std_Yellow_Img,
      clickCallback: () => clickHandler(Standard_Color.YELLOW),
    },
  ]);

  return (
    <React.Fragment>
      <Card style={{ width: "12rem" }} bg="secondary">
        <Card.Header>Neon Colors:</Card.Header>
        {NeonCardBody}
      </Card>
      <Card style={{ width: "12rem" }} bg="secondary">
        <Card.Header>Standard Colors:</Card.Header>
        {StdCardBody}
      </Card>
    </React.Fragment>
  );
};

type Props = {
  color: Color;
  callBack?: Function;
};

type ColorCardEntry = {
  src: any;
  clickCallback: (color: Color) => void;
};
