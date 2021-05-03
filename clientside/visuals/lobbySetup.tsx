import * as React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export const LobbySetup: React.FC<Props> = (
  props: Props
): React.ReactElement => {
  const [lobbyName, setLobbyName] = React.useState("");
  const { ws } = props;

  const handleCreateLobby = () => {
    ws.addEventListener("message", (evt) => console.log(evt));

    ws.send(
      JSON.stringify({
        type: "register",
        payload: lobbyName,
      })
    );

    console.log(
      ws.send(
        JSON.stringify({
          type: "list",
        })
      )
    );
  };

  return (
    <Container>
      <Row>
        <Button variant="success">Invite Player</Button>
      </Row>
      <Row>
        <Button variant="success">Invite Player</Button>
      </Row>
    </Container>
  );
};

type Props = {
  ws: WebSocket;
};
