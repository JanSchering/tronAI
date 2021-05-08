import * as React from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { CenteredStaticModal } from "../centeredStaticModal";
import { WaitWithSpinner } from "./waitWithSpinner";

import Refresh_Icon from "../../images/forward-restore.png";

export const SearchOpponent = (props: Props) => {
  const { showModal, setShowModal, playerName, ws } = props;
  const [filter, setFilter] = React.useState("");
  const [opponents, setOpponents] = React.useState([]);
  const [opponentsFiltered, setOpponentsFiltered]: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ] = React.useState(null);
  const [inviting, setInviting] = React.useState(false);
  const history = useHistory();

  React.useEffect(() => {
    ws.addEventListener("message", (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (data.type === "list") {
        setOpponents(data.names);
        if (!opponentsFiltered) {
          setOpponentsFiltered(data.names);
        }
      }
    });
    ws.send(
      JSON.stringify({
        type: "list",
      })
    );
  }, []);

  React.useEffect(() => {
    setOpponentsFiltered(opponents.filter((opp) => opp.includes(filter)));
  }, [filter]);

  const handleRefresh = () => {
    ws.send(
      JSON.stringify({
        type: "list",
      })
    );
  };

  const handleInvite = (name: string) => {
    setInviting(true);
    ws.send(
      JSON.stringify({
        type: "invite",
        payload: { sender: playerName, recipient: name },
      })
    );
  };

  const ActiveOpponents = (
    <ListGroup>
      {opponentsFiltered ? (
        opponentsFiltered.map((name, idx) => (
          <ListGroup.Item key={idx} variant="info">
            <Button variant="success" onClick={() => handleInvite(name)}>
              Invite
            </Button>
            {name}
          </ListGroup.Item>
        ))
      ) : (
        <noscript />
      )}
    </ListGroup>
  );

  return (
    <CenteredStaticModal show={showModal} onHide={() => setShowModal(false)}>
      {!inviting ? (
        <>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Search for Opponent
              <Form>
                <Form.Control
                  size="xs"
                  type="text"
                  placeholder="Name..."
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                    setFilter(evt.target.value)
                  }
                />
              </Form>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container style={{ marginBottom: "10px" }}>
              <Row>
                <Container onClick={handleRefresh}>
                  <Button variant="primary">
                    Refresh List
                    <Image
                      src={Refresh_Icon}
                      style={{
                        width: "1rem",
                        height: "1rem",
                        marginLeft: "5px",
                      }}
                      roundedCircle
                    />
                  </Button>
                </Container>
              </Row>
            </Container>
            {opponentsFiltered ? ActiveOpponents : ""}
          </Modal.Body>
        </>
      ) : (
        <WaitWithSpinner
          title="Inviting Opponent"
          message="Invitation sent, waiting for opponent to respond."
        />
      )}
    </CenteredStaticModal>
  );
};

type Props = {
  showModal: boolean;
  setShowModal: Function;
  playerName: string;
  ws: WebSocket;
};
