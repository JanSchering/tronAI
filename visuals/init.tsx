import * as React from "react";
import { ColorPicker } from "./colorPicker";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import styles from "../style/app.module.scss";

export const InitialForm = ({
  doneCallback,
  children,
}: Props): React.ReactElement => {
  const [colorP1, setColorP1] = React.useState(null);
  const [colorP2, setColorP2] = React.useState(null);
  const [nameP1, setNameP1] = React.useState("");
  const [nameP2, setNameP2] = React.useState("");

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
    <Form>
      <Row>
        <Col xs={4}>
          <Form.Label>Name</Form.Label>
          <Form.Control
            size="xs"
            type="text"
            placeholder="Large text"
            onBlur={(evt: React.ChangeEvent<HTMLInputElement>) =>
              setNameP1(evt.target.value)
            }
          />
        </Col>
        <Col xs={4}>
          <ColorPicker color={colorP1} callBack={setColorP1} />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Form.Label>Name</Form.Label>
          <Form.Control
            size="xs"
            type="text"
            placeholder="Large text"
            onBlur={(evt: React.ChangeEvent<HTMLInputElement>) =>
              setNameP2(evt.target.value)
            }
          />
        </Col>
        <Col xs={4}>
          <ColorPicker color={colorP1} callBack={setColorP2} />
        </Col>
      </Row>
      <Row className={styles.top_buffer}>
        <Col xs={4}>
          <Accordion>
            <Card bg="dark" text="light">
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  AI Setup
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>
      <Row className={styles.top_buffer}>
        <Col>
          <Button onClick={handleDone}>Done</Button>
        </Col>
      </Row>
      {children}
    </Form>
  );
};

type Props = {
  doneCallback: Function;
  children?: React.ReactChildren;
};
