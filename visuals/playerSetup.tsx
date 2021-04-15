import * as React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ColorPicker } from "./colorPicker";
import { Color } from "../game/types";

export const PlayerSetup: React.FC<Props> = (
  props: Props
): React.ReactElement => {
  const {
    colorP1,
    colorP2,
    setColorP1,
    setColorP2,
    setNameP1,
    setNameP2,
  } = props;

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
          <ColorPicker color={colorP2} callBack={setColorP2} />
        </Col>
      </Row>
    </Form>
  );
};

type Props = {
  colorP1: Color;
  colorP2: Color;
  setColorP1: (color: Color) => void;
  setColorP2: (color: Color) => void;
  setNameP1: (name: string) => void;
  setNameP2: (name: string) => void;
};
