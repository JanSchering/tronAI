import * as React from "react";
import { render } from "react-dom";
import { Player } from "./game/player";
import { Color, Direction, GridCell, Standard_Color } from "./game/types";
import { getGridMetaData, getUniqueCellId } from "./game/grid";
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
import { step, renderPlayer, reset, keydownListener } from "./game/environment";
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
        const gridInfo = getGridMetaData(
          PLAYER_WIDTH,
          PLAYER_HEIGHT,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
        const filledCellTracker: any = {};
        const p1CellID = getUniqueCellId(P1_STARTING_POS);
        const p2CellID = getUniqueCellId(P2_STARTING_POS);
        filledCellTracker[p1CellID] = true;
        filledCellTracker[p2CellID] = true;
        //Initially render the players
        renderPlayer(player1, ctx, gridInfo);
        renderPlayer(player2, ctx, gridInfo);
        //Start listening to input
        keydownListener(player1, player2);
        //Start the game Loop
        const gameLoop = setInterval(() => {
          step(player1, player2, ctx, gridInfo, filledCellTracker);
          if (!player1.alive) {
            reset(player1, player2, ctx, gridInfo);
            setP2Score(p2Score + 1);
            clearInterval(gameLoop);
          } else if (!player2.alive) {
            reset(player1, player2, ctx, gridInfo);
            setP1Score(p1Score + 1);
            clearInterval(gameLoop);
          } else {
            const p1NewCellID = getUniqueCellId(player1.position);
            const p2NewCellID = getUniqueCellId(player2.position);
            filledCellTracker[p1NewCellID] = true;
            filledCellTracker[p2NewCellID] = true;
            renderPlayer(player1, ctx, gridInfo);
            renderPlayer(player2, ctx, gridInfo);
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
