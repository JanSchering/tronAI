import * as React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import { ColorPicker } from "./colorPicker";
import { ColorPickerV2 } from "./colorPickerV2";
import { Color } from "../game/types";
import styles from "../style/app.module.scss";

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

  /**
   * @description This function is necessary to be able to close popovers from inside the popover.
   */
  const handleInternalClose = () => {
    // By setting rootClose to true in the overlayTrigger,
    // the popover only waits for a click outside of the popover to register
    document.body.click();
  };

  const createPopover = (color: Color, callBack: Function) => (
    <Popover id="popover-basic" className="bg-secondary">
      <Popover.Title as="h3" className="bg-secondary">
        <Row>
          <Col md={{ span: 7, offset: 1 }}>
            <h6 className={styles.vert_20} style={{ position: "absolute" }}>
              Color Picker
            </h6>
          </Col>
          <Col md={{ span: 1 }}>
            <Button variant="outline-dark" onClick={handleInternalClose}>
              X
            </Button>
          </Col>
        </Row>
      </Popover.Title>
      <Popover.Content className={styles.no_padding}>
        <ColorPickerV2 color={colorP1} callBack={setColorP1} />
      </Popover.Content>
    </Popover>
  );

  const p1PopOver = createPopover(colorP1, setColorP1);
  const p2PopOver = createPopover(colorP2, setColorP2);

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
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={p1PopOver}
            rootClose={true}
          >
            <Button variant="primary" className={styles.init_btn_center}>
              Color Picker P1
            </Button>
          </OverlayTrigger>
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
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={p2PopOver}
            rootClose={true}
          >
            <Button variant="primary" className={styles.init_btn_center}>
              Color Picker P2
            </Button>
          </OverlayTrigger>
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
