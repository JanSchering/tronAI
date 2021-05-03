import * as React from "react";
import { render } from "react-dom";
import { Main } from "./visuals/home";

const App: React.FC<any> = (): React.ReactElement => {
  const [ws, setWs]: [WebSocket, (ws: WebSocket) => any] = React.useState(null);
  const [internalTimeout, setInternalTimeout] = React.useState(250); // Initial timeout duration.

  // single websocket instance for the client. Constantly trying to reconnect in case of lost connection.
  React.useEffect(() => {
    connect();
  }, [internalTimeout]);

  /**
   * @description Establishes connection with the websocket.
   * Also ensures constant reconnection if connection closes
   */
  const connect = () => {
    var ws = new WebSocket("ws://localhost:8999/");
    var connectInterval: any;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket main component");

      setWs(ws);

      clearTimeout(connectInterval); // clear Interval on open of websocket connection
    };

    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10,
          (internalTimeout * 2) / 1000
        )} second.`,
        e.reason
      );

      connectInterval = setTimeout(check, Math.min(10000, internalTimeout)); //call check function after timeout
    };

    ws.onerror = (err) => {
      console.error("Socket encountered error: ", err, "Closing socket");

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
