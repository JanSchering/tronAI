import * as React from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

import { CenteredStaticModal } from "../centeredStaticModal";
import { WaitWithSpinner } from "./waitWithSpinner";

import Neon_Blue_Img from "../../images/neon_blue.png";
import Neon_Red_Img from "../../images/neon_red.png";
import Neon_Green_Img from "../../images/neon_green.png";
import Neon_Yellow_Img from "../../images/neon_yellow.png";
import Std_Blue_Img from "../../images/standard_blue.jpeg";
import Std_Red_Img from "../../images/standard_red.jpg";
import Std_Green_Img from "../../images/standard_green.jpeg";
import Std_Yellow_Img from "../../images/standard_yellow.jpeg";

import styles from "../../style/app.module.scss";
import { Color, Standard_Color } from "../../../game/types";
import {
  NEON_BLUE,
  NEON_GREEN,
  NEON_RED,
  NEON_YELLOW,
} from "../../../game/literals";

export const ColorPicker = (props: Props) => {
  const { showModal, setShowModal } = props;
  const [color, setColor] = React.useState(null);
  const history = useHistory();
  const [ready, setReady] = React.useState(false);

  /**
   * @description Create a row for the colorPicker.
   * @param row - Metadata to build up the row.
   */
  const createRow = (row: ColorScheme): JSX.Element => {
    return (
      <Container>
        <Row>
          <h5>{row.title}</h5>
        </Row>
        <Row>
          {row.members.map((field) => (
            <Col md="auto">
              <Image
                src={field.src}
                style={{ width: "2rem" }}
                className={styles.sep_xs}
                onClick={() => setColor(field.color)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    );
  };

  const STANDARD_ROW = createRow({
    title: "Standard Colors",
    members: [
      { color: Standard_Color.RED, src: Std_Red_Img },
      { color: Standard_Color.BLUE, src: Std_Blue_Img },
      { color: Standard_Color.GREEN, src: Std_Green_Img },
      { color: Standard_Color.YELLOW, src: Std_Yellow_Img },
    ],
  });

  const NEON_ROW = createRow({
    title: "Neon Colors",
    members: [
      { color: NEON_RED, src: Neon_Red_Img },
      { color: NEON_BLUE, src: Neon_Blue_Img },
      { color: NEON_GREEN, src: Neon_Green_Img },
      { color: NEON_YELLOW, src: Neon_Yellow_Img },
    ],
  });

  const handleReady = () => {
    setReady(true);
    // TODO: On ready, send ready state to server and wait to receive further messages from serverside.
  };

  return (
    <CenteredStaticModal show={showModal} onHide={() => setShowModal(false)}>
      {!ready ? (
        <>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Choose Your Color
            </Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              {STANDARD_ROW}
              {NEON_ROW}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleReady}>
                Ready
              </Button>
            </Modal.Footer>
          </Form>
        </>
      ) : (
        <WaitWithSpinner
          title="Match Setup"
          message="Waiting for opponent to finish Setup"
        />
      )}
    </CenteredStaticModal>
  );
};

type Props = {
  showModal: boolean;
  setShowModal: Function;
  setColor: Function;
};

type Field = {
  color: Color;
  src: any;
};

type ColorScheme = {
  title: string;
  members: Field[];
};
