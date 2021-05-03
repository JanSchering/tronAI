import * as React from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { CenteredStaticModal } from "../centeredStaticModal";

export const Invite = (props: Props) => {
  const { showModal, decline, sender } = props;

  const history = useHistory();

  const handleAccept = () => {};

  return (
    <CenteredStaticModal show={showModal} onHide={decline}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Invitation Received
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>You were invited to a match by: {sender}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAccept}>
          Accept
        </Button>
      </Modal.Footer>
    </CenteredStaticModal>
  );
};

type Props = {
  showModal: boolean;
  decline: Function;
  sender: string;
};
