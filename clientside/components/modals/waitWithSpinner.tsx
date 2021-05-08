import * as React from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

export const WaitWithSpinner = (props: Props) => {
  return (
    <Container>
      <Modal.Header closeButton>
        <Row>
          <Col>
            <h5>{props.title ? props.title : "Processing"}</h5>
          </Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <p>
              {props.message ? props.message : "Processing the information"}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Spinner animation="border" />
          </Col>
        </Row>
      </Modal.Body>
    </Container>
  );
};

type Props = {
  title?: string;
  message?: string;
  spinnerSize?: string;
};
