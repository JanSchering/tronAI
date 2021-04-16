import * as React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Color } from "../game/types";
import Neon_Blue from "./images/neon_blue.png";
import Neon_Red from "./images/neon_red.png";
import Neon_Green from "./images/neon_green.png";
import Neon_Yellow from "./images/neon_yellow.png";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import styles from "../style/app.module.scss";

export const ColorPickerV2 = ({
  color,
  callBack,
}: Props): React.ReactElement => {
  const [currentColor, setCurrentColor] = React.useState(color);

  const clickHandler = (color: Color) => {
    setCurrentColor(color);
    if (callBack) {
      callBack(color);
    }
  };

  return (
    <Card style={{ width: "12rem" }} bg="secondary">
      <Card.Header>Neon Colors:</Card.Header>
      <Card.Body>
        <Image
          src={Neon_Blue}
          style={{ width: "4rem" }}
          className={styles.sep_xs}
          onClick={() => {
            clickHandler(Color.NEON_BLUE);
          }}
        />
        <Image
          src={Neon_Red}
          style={{ width: "4rem" }}
          className={styles.sep_xs}
          onClick={() => {
            clickHandler(Color.NEON_RED);
          }}
        />
        <Image
          src={Neon_Green}
          style={{ width: "4rem" }}
          className={styles.sep_xs}
          onClick={() => {
            clickHandler(Color.NEON_GREEN);
          }}
        />
        <Image
          src={Neon_Yellow}
          style={{ width: "4rem" }}
          className={styles.sep_xs}
          onClick={() => {
            clickHandler(Color.NEON_YELLOW);
          }}
        />
      </Card.Body>
    </Card>
  );
};

type Props = {
  color: Color;
  callBack?: Function;
};
