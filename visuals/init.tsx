import * as React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import IntroImg from "./images/tronImage_polished.jpeg";

import styles from "../style/app.module.scss";
import { AISetup } from "./aiSetup";
import { PlayerSetup } from "./playerSetup";
import { Color } from "../game/types";

export const InitialForm = ({
  doneCallback,
  children,
}: Props): React.ReactElement => {
  const [colorP1, setColorP1] = React.useState(Color.NEON_RED);
  const [colorP2, setColorP2] = React.useState(Color.NEON_BLUE);
  const [nameP1, setNameP1] = React.useState("");
  const [nameP2, setNameP2] = React.useState("");
  const [aiSetupToggled, setAiSetupToggled] = React.useState(false);
  const [playerSetupToggled, setPlayerSetupToggled] = React.useState(true);
  const [aiEnabled, setAiEnabled] = React.useState(false);

  const handlePlayerToggle = () => {
    if (!playerSetupToggled) setAiSetupToggled(false);
    setPlayerSetupToggled(!playerSetupToggled);
  };

  const handleAIToggle = () => {
    if (!aiSetupToggled) setPlayerSetupToggled(false);
    setAiSetupToggled(!aiSetupToggled);
  };

  React.useEffect(() => {}, []);
  const handleDone = () => {
    doneCallback({
      p1: {
        color: colorP1,
        name: nameP1,
      },
      p2: {
        color: colorP2,
        name: nameP2,
      },
    });
  };

  return (
    <Card
      bg="dark"
      style={{ width: "36rem" }}
      className={styles.center_relative}
    >
      <Card.Img variant="top" src={IntroImg} />
      <Card.Body>
        <Row>
          <Col>
            <Accordion defaultActiveKey="0">
              <Card bg="dark" text="light">
                <Card.Header>
                  <Row>
                    <Col xs={5}>
                      <Form.Check
                        type={"radio"}
                        id={`ai-checkbox`}
                        label={`Local Multiplayer`}
                        className={styles.vert_20}
                        checked={!aiEnabled}
                        onChange={() => setAiEnabled(false)}
                      />
                    </Col>
                    <Col xs={5}>
                      <Accordion.Toggle
                        as={Button}
                        variant={!aiEnabled ? "primary" : "secondary"}
                        eventKey="0"
                        onClick={handlePlayerToggle}
                      >
                        Player Setup {playerSetupToggled ? "▼" : "►"}
                      </Accordion.Toggle>
                    </Col>
                  </Row>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <PlayerSetup
                    colorP1={colorP1}
                    colorP2={colorP2}
                    setColorP1={setColorP1}
                    setColorP2={setColorP2}
                    setNameP1={setNameP1}
                    setNameP2={setNameP2}
                  />
                </Accordion.Collapse>
              </Card>
              <Card bg="dark" text="light">
                <Card.Header>
                  <Row>
                    <Col xs={5}>
                      <Form.Check
                        type={"radio"}
                        id={`ai-checkbox`}
                        label={`AI Mode`}
                        className={styles.vert_20}
                        checked={aiEnabled}
                        onChange={() => setAiEnabled(true)}
                      />
                    </Col>
                    <Col xs={5}>
                      <Accordion.Toggle
                        as={Button}
                        variant={aiEnabled ? "primary" : "secondary"}
                        eventKey="1"
                        onClick={handleAIToggle}
                      >
                        AI Setup {aiSetupToggled ? "▼" : "►"}
                      </Accordion.Toggle>
                    </Col>
                  </Row>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <AISetup />
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
        <Row className={styles.top_buffer}>
          <Col className={styles.center_col}>
            <Button onClick={handleDone} variant="success" size="lg">
              Play ►
            </Button>
          </Col>
        </Row>
        {children}
      </Card.Body>
    </Card>
  );
};

type Props = {
  doneCallback: Function;
  children?: React.ReactChildren;
};
