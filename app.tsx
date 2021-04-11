import * as React from "react";
import { render } from "react-dom";
import { Player, playerTest } from "./game/player";
import { Color, Direction } from "./game/types";
import { X_START, Y_START } from "./game/literals";
import { Canvas, useCanvas } from "./game/canvas";
import { InitialForm } from "./game/init";
import { step, renderPlayer, reset, keydownListener } from "./game/environment";
import { ScoreBoard } from "./game/scoreBoard";
import "./style/global.scss";

export const Main: React.FC = React.memo(
  (): React.ReactElement => {
    const [setupResponse, setSetupResponse] = React.useState(null);
    const [
      p1,
      setP1Color,
      setP1Coordinates,
      setP1Direction,
      setP1Score,
      setP1Alive,
      setP1Name,
      getP1Direction,
    ] = playerTest({
      color: Color.RED,
      name: "",
      coordinates: {
        x: X_START,
        y: Y_START,
      },
    });

    console.log(setP1Direction);
    setP1Direction(Direction.LEFT);
    getP1Direction();
    const [
      p2,
      setP2Color,
      setP2Coordinates,
      setP2Direction,
      setP2Score,
      setP2Alive,
      setP2Name,
    ] = playerTest({
      color: Color.BLUE,
      name: "",
      coordinates: {
        x: X_START,
        y: Y_START * 2,
      },
    });
    const [ctx, setCtx] = React.useState(null);
    const [stepCount, setStepCount] = React.useState(0);

    const canvasRef = useCanvas(([canvas, ctx]) => {
      setCtx(ctx);
    });

    React.useEffect(() => {
      console.log("Start game");
      if (setupResponse && ctx) {
        //process the responses
        setP1Color(setupResponse.p1.color);
        setP2Color(setupResponse.p2.color);
        setP1Name(setupResponse.p1.name);
        setP2Name(setupResponse.p2.name);
        //Initially render the players
        renderPlayer(p1, ctx);
        renderPlayer(p2, ctx);
        //Start listening to input
        keydownListener(p1, p2, setP1Direction, setP2Direction);
        //Start the game Loop
        setInterval(() => {
          step(
            p1,
            setP1Coordinates,
            setP2Coordinates,
            setP1Alive,
            setP2Alive,
            p2,
            ctx
          );
          console.log("step taken", p1.direction, p2.direction);
          console.log(getP1Direction());
          if (!p1.alive) {
            setP1Alive(false);
            setP2Score(p2.score + 1);
            reset(
              p1,
              p2,
              setP1Direction,
              setP1Coordinates,
              setP2Coordinates,
              setP2Direction,
              ctx
            );
          } else if (!p2.alive) {
            setP2Alive(false);
            setP1Score(p1.score + 1);
            reset(
              p1,
              p2,
              setP1Direction,
              setP1Coordinates,
              setP2Coordinates,
              setP2Direction,
              ctx
            );
          } else {
            renderPlayer(p1, ctx);
            renderPlayer(p2, ctx);
          }
          setStepCount(stepCount + 1);
        }, 33);
      }
    }, [setupResponse]);

    return React.useMemo(() => {
      return (
        <div>
          {!setupResponse ? <ScoreBoard p1={p1} p2={p2} /> : <noscript />}
          <Canvas width={1000} height={500} canvasRef={canvasRef} />
          {!setupResponse ? (
            <InitialForm doneCallback={setSetupResponse} />
          ) : (
            <noscript />
          )}
        </div>
      );
    }, [setupResponse]);
  }
);

render(<Main />, document.getElementById("root"));
