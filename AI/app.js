import { Model } from "./model";
import { Orchestrator } from "./orchestrator";
import { Memory } from "./memory";
import { createCanvas } from "./visual.js";
import * as Literals from "../game/literals";
import styles from "../style/canvas.module";

/**
 * The role of the policy network is to select an action based on the observed
 * state of the system.
 * There are 4 possible actions to choose from: [UP, DOWN, LEFT, RIGHT],
 * which turn the players' character in the according direction.
 */
class PolicyNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.memory = new Memory(500);
    this.p1Model = new Model(100);
    this.p2Model = new Model(100);
  }

  async train(discountRate = 0.95, numGames = 1000, maxStepsPerGame = 500) {
    const orchestrator = new Orchestrator(
      this.canvas,
      this.p1Model,
      this.p2Model,
      this.memory,
      discountRate,
      maxStepsPerGame
    );
    for (let i = 0; i < numGames; ++i) {
      await orchestrator.run();
    }
  }
}

function clickListener() {
  this.resolve();
}

const buttonInput = () => {
  return new Promise((resolve) => {
    const button = document.getElementById("trainButton");
    button.removeEventListener("click", clickListener);
    button.addEventListener("click", clickListener.bind({ resolve }));
  });
};

async function runApp() {
  const { CANVAS_WIDTH, CANVAS_HEIGHT } = Literals;
  const gameCanvas = createCanvas(
    "tron",
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    document.body,
    styles.board
  );
  console.log("CREATE NEW NETWORK");
  const net = new PolicyNetwork(gameCanvas);
  await buttonInput();
  net.train();
}

runApp();
