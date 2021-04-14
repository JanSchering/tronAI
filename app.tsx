import * as React from "react";
import { render } from "react-dom";
import { Player } from "./game/player";
import { Color, Direction } from "./game/types";
import { X_START, Y_START } from "./game/literals";
import { Canvas, useCanvas } from "./visuals/canvas";
import { InitialForm } from "./visuals/init";
import { step, renderPlayer, reset, keydownListener } from "./game/environment";
import { ScoreBoard } from "./visuals/scoreBoard";
import "./style/global.scss";
import Container from "react-bootstrap/Container";

export const Main: React.FC = React.memo(
  (): React.ReactElement => {
    const [setupResponse, setSetupResponse] = React.useState(null);
    const [setupDone, setSetupDone] = React.useState(false);
    const [ctx, setCtx] = React.useState(null);
    const [p1Score, setP1Score] = React.useState(0);
    const [p2Score, setP2Score] = React.useState(0);
    const [player1] = React.useState(
      new Player({
        name: "",
        color: Color.RED,
        coordinates: {
          x: X_START,
          y: Y_START,
        },
      })
    );
    const [player2] = React.useState(
      new Player({
        name: "",
        color: Color.BLUE,
        coordinates: {
          x: X_START,
          y: Y_START * 2,
        },
      })
    );

    const canvasRef = useCanvas(([canvas, ctx]) => {
      setCtx(ctx);
    });

    React.useEffect(() => {
      if (setupResponse) {
        //process the responses
        player1.setName(setupResponse.p1.name);
        player1.setColor(setupResponse.p1.color);
        player2.setName(setupResponse.p2.name);
        player2.setColor(setupResponse.p2.color);
        setSetupDone(true);
      }
    }, [setupResponse]);

    React.useEffect(() => {
      if (setupDone && ctx) {
        //Initially render the players
        renderPlayer(player1, ctx);
        renderPlayer(player2, ctx);
        //Start listening to input
        keydownListener(player1, player2);
        //Start the game Loop
        const gameLoop = setInterval(() => {
          step(player1, player2, ctx);
          if (!player1.getAlive()) {
            reset(player1, player2, ctx);
            setP2Score(p2Score + 1);
            clearInterval(gameLoop);
          } else if (!player2.getAlive()) {
            reset(player1, player2, ctx);
            setP1Score(p1Score + 1);
            clearInterval(gameLoop);
          } else {
            renderPlayer(player1, ctx);
            renderPlayer(player2, ctx);
          }
        }, 33);
      }
    }, [setupDone, p1Score, p2Score]);

    return (
      <Container>
        {setupResponse ? (
          <ScoreBoard
            p1={{ name: player1.getName(), score: p1Score }}
            p2={{ name: player2.getName(), score: p2Score }}
          />
        ) : (
          <noscript />
        )}
        <Canvas width={1000} height={500} canvasRef={canvasRef} />
        {!setupResponse ? (
          <InitialForm doneCallback={setSetupResponse} />
        ) : (
          <noscript />
        )}
      </Container>
    );
  }
);

render(<Main />, document.getElementById("root"));
