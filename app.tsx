import * as React from "react";
import { render } from "react-dom";
import { Player } from "./game/player";
import { Color, Direction, GridCell, Standard_Color } from "./game/types";
import { Grid } from "./game/grid";
import {
  P1_STARTING_POS,
  P2_STARTING_POS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "./game/literals";
import { Canvas, useCanvas } from "./visuals/canvas";
import { InitialForm } from "./visuals/init";
import {
  step,
  renderPlayers,
  reset,
  keydownListener,
} from "./game/environment";
import { ScoreBoard } from "./visuals/scoreBoard";
import "./style/global.scss";
import styles from "./style/app.module.scss";
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
        color: Standard_Color.RED,
        position: P1_STARTING_POS,
      })
    );
    const [player2] = React.useState(
      new Player({
        name: "",
        color: Standard_Color.BLUE,
        position: P2_STARTING_POS,
      })
    );

    const canvasRef = useCanvas(([canvas, ctx]) => {
      setCtx(ctx);
    }, setupResponse);

    React.useEffect(() => {
      if (setupResponse) {
        //process the responses
        player1.name = setupResponse.p1.name;
        player1.color = setupResponse.p1.color;
        player2.name = setupResponse.p2.name;
        player2.color = setupResponse.p2.color;
        setSetupDone(true);
      }
    }, [setupResponse]);

    React.useEffect(() => {
      if (setupDone && ctx) {
        const grid = new Grid({
          numRows: CANVAS_HEIGHT / PLAYER_HEIGHT,
          numCols: CANVAS_WIDTH / PLAYER_WIDTH,
          cellHeight: PLAYER_HEIGHT,
          cellWidth: PLAYER_WIDTH,
        });
        grid.setValue(1, P1_STARTING_POS.rowIdx, P1_STARTING_POS.colIdx);
        grid.setValue(1, P2_STARTING_POS.rowIdx, P2_STARTING_POS.colIdx);
        //Initially render the players
        renderPlayers([player1, player2], ctx, grid);
        //Start listening to input
        keydownListener(player1, player2);
        //Start the game Loop
        const gameLoop = setInterval(() => {
          step(player1, player2, grid);
          if (!player1.alive) {
            reset(player1, player2, ctx, grid);
            setP2Score(p2Score + 1);
            clearInterval(gameLoop);
          } else if (!player2.alive) {
            reset(player1, player2, ctx, grid);
            setP1Score(p1Score + 1);
            clearInterval(gameLoop);
          } else {
            grid.setValue(1, player1.position.rowIdx, player1.position.colIdx);
            grid.setValue(1, player2.position.rowIdx, player2.position.colIdx);
            renderPlayers([player1, player2], ctx, grid);
          }
        }, 40);
      }
    }, [setupDone, p1Score, p2Score]);

    return setupResponse ? (
      <Container>
        <ScoreBoard
          p1={{ name: player1.name, score: p1Score }}
          p2={{ name: player2.name, score: p2Score }}
        />
        <Canvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          canvasRef={canvasRef}
        />
      </Container>
    ) : (
      <Container className={styles.app_container}>
        <InitialForm doneCallback={setSetupResponse} />
      </Container>
    );
  }
);

render(<Main />, document.getElementById("root"));
