import * as React from "react";
import { ColorPicker } from "./colorPicker";
import { Player } from "./player";

export const InitialForm = ({
  doneCallback,
  children,
}: Props): React.ReactElement => {
  const [colorP1, setColorP1] = React.useState(null);
  const [colorP2, setColorP2] = React.useState(null);
  const [nameP1, setNameP1] = React.useState("");
  const [nameP2, setNameP2] = React.useState("");

  React.useEffect(() => {}, []);
  const handleDone = () => {
    doneCallback({
      p1: {
        color: colorP1,
        name: nameP1,
      },
      p2: {
        color: colorP2,
        name: nameP2,
      },
    });
  };

  return (
    <div className="setup">
      <p>Enter Names and choose color:</p>
      <div className="player">
        <label>Player 1</label>
        <input type="text" onBlur={(evt) => setNameP1(evt.target.value)} />
        <ColorPicker color={colorP1} clickHandler={setColorP1} />
      </div>
      <br />
      <div className="player">
        <label>Player 2</label>
        <input type="text" onBlur={(evt) => setNameP2(evt.target.value)} />
        <ColorPicker color={colorP2} clickHandler={setColorP2} />
      </div>
      <br />
      <input type="button" value="Done" onClick={handleDone} />
      {children}
    </div>
  );
};

type Props = {
  doneCallback: Function;
  children?: React.ReactChildren;
};
