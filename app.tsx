import * as WebSocket from "ws";
import * as React from "react";
import { render } from "react-dom";
import { Main } from "./home";

const App: React.FC<any> = (): React.ReactElement => {
  const [ws, setWs]: [WebSocket, (ws: WebSocket) => any] = React.useState(null);
  const [internalTimeout, setInternalTimeout] = React.useState(250); // Initial timeout duration.

  // single websocket instance for the own application and constantly trying to reconnect.
  React.useEffect(() => {
    connect();
  }, []);

  /**
   * @description Establishes connection with the websocket.
   * and also ensures constant reconnection if connection closes
   */
  const connect = () => {
    var ws = new WebSocket("ws://localhost:3000/ws");
    var connectInterval: any;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket main component");

      setWs(ws);
      setInternalTimeout(250);

      clearTimeout(connectInterval); // clear Interval on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10,
          (internalTimeout * 2) / 1000
        )} second.`,
        e.reason
      );

      setInternalTimeout(internalTimeout * 2); //increment retry interval
      connectInterval = setTimeout(check, Math.min(10000, internalTimeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };
  };

  /**
   * @description check if the connection is close, if so attempts to reconnect.
   */
  const check = () => {
    if (!ws || ws.readyState == WebSocket.CLOSED) connect(); //check if websocket instance is closed, if so call `connect` function.
  };

  return <Main ws={ws as any} />;
};

render(<App />, document.getElementById("root"));
