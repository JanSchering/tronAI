import * as React from "react";
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
    <Form>
      <Form.Label>Lobby Name:</Form.Label>
      <Form.Control
        size="xs"
        type="text"
        placeholder="Large text"
        onBlur={(evt: React.ChangeEvent<HTMLInputElement>) =>
          setLobbyName(evt.target.value)
        }
      />
      <Button variant="success" onClick={handleCreateLobby}>
        Create Lobby
      </Button>
    </Form>
  );
};

type Props = {
  ws: WebSocket;
};
