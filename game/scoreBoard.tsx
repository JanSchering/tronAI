import * as React from "react";
import { Player } from "./player";

export const ScoreBoard = ({ p1, p2 }: Props): React.ReactElement => {

  return (
    <div>
      <p>
        {p1.name}: {p1.score}
      </p>
      <p>
        {p2.name}: {p2.score}
      </p>
    </div>
  );
};

type Props = {
  p1: {
    name: string;
    score: number | string;
  };
  p2: {
    name: string;
    score: number | string;
  };
};
