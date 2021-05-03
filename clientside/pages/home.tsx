import * as React from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import BackGround_Image from "../images/tron_polished.jpg";
import PlayButton_Image from "../images/play-button.png";
import PlayButton_White_Image from "../images/play-button_white.png";

import "../style/global.scss";
import styles from "../style/app.module.scss";

export const Home = (): React.ReactElement => {
  const history = useHistory();

  const handlePlay = (path: string) => {
    history.push(path);
  };

  return (
    <Container style={{ backgroundImage: `url(${BackGround_Image})` }}>
      <Row>
        <Container onClick={() => handlePlay("mode")}>
          <Button variant="success" size="lg">
            Play
            <Image
              src={PlayButton_White_Image}
              style={{ width: "2rem", marginLeft: "5px" }}
              roundedCircle
            />
          </Button>
        </Container>
      </Row>
    </Container>
  );
};
