import * as React from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import BackGround_Image from "../images/tron_clean.jpg";
import PlayButton_White_Image from "../images/play-button_white.png";

import { ChooseName } from "../components/modals/chooseName";
import { SearchOpponent } from "../components/modals/searchOpponent";
import { Invite } from "../components/modals/invite";
import { ColorPicker } from "../components/modals/colorPicker";

export const OnlineSetup = (): React.ReactElement => {
  const UNKNOWN_PLAYER = "Unknown";
  const history = useHistory();
  const { name = UNKNOWN_PLAYER } = history.location.state as State;
  const [modalShow, setModalShow] = React.useState(false);
  const [ws, setWs]: [WebSocket, (ws: WebSocket) => any] = React.useState(null);
  const [inviteReceived, setInviteReceived]: [
    Invite,
    React.Dispatch<React.SetStateAction<Invite>>
  ] = React.useState(null);
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  React.useEffect(() => {
    var ws = new WebSocket("ws://localhost:8999/");

    ws.onopen = () => {
      if (name !== UNKNOWN_PLAYER) {
        ws.send(
          JSON.stringify({
            type: "register",
            payload: name,
          })
        );
      }
      ws.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        console.log(data.type);
        if (data.type === "invite") {
          setInviteReceived({
            sender: data.sender,
          });
        } else if (data.type === "connect") {
          /*
           * Connection to opponent is established, both should be picking colors now and signal that they are
           * ready. The the match should be started
           */
        }
      });

      console.log("connected websocket main component");
      setWs(ws);
    };
  }, []);

  const handlePlay = (path: string) => {
    history.push(path);
  };

  const decline = () => {
    setInviteReceived(null);
  };

  return (
    <Container style={{ backgroundImage: `url(${BackGround_Image})` }}>
      <Card>
        <Card.Header>Online Matchmaking</Card.Header>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            Choose between Random Matchups and inviting currently active
            Players.
          </Card.Text>
          <Row>
            <Button variant="success" size="lg">
              Random Match
              <Image
                src={PlayButton_White_Image}
                style={{ width: "2rem", marginLeft: "5px" }}
                roundedCircle
              />
            </Button>
          </Row>
          <Row>
            <Button
              variant="success"
              size="lg"
              onClick={() => setModalShow(true)}
            >
              Invite Player
              <Image
                src={PlayButton_White_Image}
                style={{ width: "2rem", marginLeft: "5px" }}
                roundedCircle
              />
            </Button>
            {ws ? (
              <SearchOpponent
                showModal={modalShow}
                setShowModal={setModalShow}
                playerName={name}
                ws={ws}
              />
            ) : (
              <noscript />
            )}
            <Invite
              showModal={inviteReceived !== null}
              decline={decline}
              sender={inviteReceived ? inviteReceived.sender : ""}
            />
            <ColorPicker
              showModal={showColorPicker}
              setShowModal={setShowColorPicker}
              setColor={() => {}}
            />
            <Button
              variant="success"
              size="lg"
              onClick={() => setShowColorPicker(true)}
            >
              Test ColorPicker
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

type State = {
  name: string;
};

type Invite = {
  sender: string;
};
