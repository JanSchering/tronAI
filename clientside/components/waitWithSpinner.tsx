import * as React from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const WaitWithSpinner = (props: Props) => {
  return (
    <Container>
      <Row>
        <Col>
          <h5>{props.title ? props.title : "Processing"}</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{props.message ? props.message : "Processing the information"}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Spinner animation="border" />
        </Col>
      </Row>
    </Container>
  );
};

type Props = {
  title?: string;
  message?: string;
  spinnerSize?: string;
};
