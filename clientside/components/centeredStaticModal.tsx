import * as React from "react";
import Modal from "react-bootstrap/Modal";

export const CenteredStaticModal = (props: ModalProps) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      {props.children}
    </Modal>
  );
};

type ModalProps = {
  onHide: Function;
  show: boolean;
  children: React.ReactElement[];
};
