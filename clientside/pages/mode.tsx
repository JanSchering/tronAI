import * as React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import BackGround_Image from "../images/tron_clean.jpg";
import PlayButton_Image from "../images/play-button.png";
import PlayButton_White_Image from "../images/play-button_white.png";

import { ChooseName } from "../components/modals/chooseName";

import "../style/global.scss";
import styles from "../style/app.module.scss";

export const Mode = (): React.ReactElement => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <Container style={{ backgroundImage: `url(${BackGround_Image})` }}>
      <Card>
        <Card.Header>Menu</Card.Header>
        <Card.Body>
          <Card.Title>Mode Selection</Card.Title>
          <Card.Text>
            Choose whether you want to play locally or online.
          </Card.Text>
          <Row>
            <Button variant="success" size="lg">
              Offline
              <Image
                src={PlayButton_White_Image}
                style={{ width: "2rem", marginLeft: "5px" }}
                roundedCircle
              />
            </Button>
          </Row>
          <Row>
            <Button
              variant="success"
              size="lg"
              onClick={() => setModalShow(true)}
            >
              Online
              <Image
                src={PlayButton_White_Image}
                style={{ width: "2rem", marginLeft: "5px" }}
                roundedCircle
              />
            </Button>
            <ChooseName showModal={modalShow} setShowModal={setModalShow} />
          </Row>
          <Row>
            <Button variant="success" size="lg">
              Admin
              <Image
                src={PlayButton_White_Image}
                style={{ width: "2rem", marginLeft: "5px" }}
                roundedCircle
              />
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};
