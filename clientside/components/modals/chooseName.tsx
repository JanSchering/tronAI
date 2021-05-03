import * as React from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { CenteredStaticModal } from "../centeredStaticModal";

export const ChooseName = (props: Props) => {
  const { showModal, setShowModal } = props;
  const [name, setName] = React.useState("");

  const history = useHistory();

  const handleSubmit = () => {
    history.push({
      pathname: "/onlinesetup",
      state: {
        name,
      },
    });
  };

  return (
    <CenteredStaticModal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Choose Name for Online Mode
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Control
            size="xs"
            type="text"
            placeholder="Name..."
            onBlur={(evt: React.ChangeEvent<HTMLInputElement>) =>
              setName(evt.target.value)
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </CenteredStaticModal>
  );
};

type Props = {
  showModal: boolean;
  setShowModal: Function;
};
