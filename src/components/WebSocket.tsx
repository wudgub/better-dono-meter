import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
const axios = require('axios').default;

import config from '../config/config';
import * as api from '../api/twitch';



// TODO:
// https://dev.twitch.tv/docs/eventsub/handling-websocket-events/
// https://www.npmjs.com/package/react-use-websocket
// should i switch to webhooks?
// is cert required?


export const WebSocket = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://eventsub.wss.twitch.tv/ws');
  const [messageHistory, setMessageHistory] = useState([]);
  const [socketID, setSocketID] = useState(null);
  const [subEnabled, setSubEnabled] = useState(false);
  const [broadcasterID, setBroadcasterID] = useState(null);
  const [encodedToken, setEncodedToken] = useState(null);


  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);

  // const oAuthPromise = new Promise((resolve, reject) => {
  //   resolve(api.getOAuthToken(config.app_id, config.app_secret));
  // })



  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastJsonMessage['metadata']['message_type']));
      // switch statement handles messages from API:
      // https://dev.twitch.tv/docs/eventsub/handling-websocket-events/
      switch (lastJsonMessage["metadata"]["message_type"]) {
        // Called when WS first opened.
        case "session_welcome":
            console.log('session_welcome hit');
            if(socketID == null) {
              setSocketID(lastJsonMessage["payload"]["session"]["id"]);
            }
            if (encodedToken == null) {
              api.getOAuthToken(config.app_id, config.app_secret)
                .then((res) => {
                  console.log('setting token...', res.access_token);
                  setEncodedToken(res.access_token);
                  api.validateToken(res.access_token)
                    .then((res) => { 
                      let msg = "OAuth token validated at: " + new Date();
                      console.log(msg);
                      return msg;
                    })
                    .catch((err) => {
                      console.log(err);
                      throw err;
                    })
                })
                .catch((err) => {
                  console.error(err);
                  throw err;
                })

            // Finally need to connect EventSub:
            // https://dev.twitch.tv/docs/eventsub/eventsub-reference/

            }
            break;
        // Called sporadically to 
        case "session_keepalive":
            console.log("keepalive hit");
            break;
        case "notification":
            console.log("notification hit");
            break;
        case "session_reconnect":
            console.log("session_reconnect");
            break;
        default:
            console.log("default hit");
            break;
      }

      if(lastJsonMessage['metadata']['message_type'] == 'session_welcome') {
        setSocketID(lastJsonMessage["payload"]["session"]["id"]);
      }
    }
  }, [lastJsonMessage, setMessageHistory]);

  useEffect(() => {
    if(broadcasterID == null && encodedToken != null) {
      api.getBroadcasterID('wudgub', encodedToken)
        .then((res) => {
          console.log('broadcaster res: ', res);
          //setBroadcasterID()
        })
        .catch((err) => {
          console.error(err);
          throw err;
        })
    }
  }, [encodedToken]);

  const handleUserToken = useCallback(() =>{
    let w = "we";
    return ("sd");
  }, [])

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('wss://eventsub.wss.twitch.tv/ws'),
    []
  );
  const handleClickSendMessage = useCallback(() => sendJsonMessage({'Hello': 'World'}), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <button onClick={handleUserToken}>Connect Twitch</button>
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastJsonMessage ? <span>Last message: {JSON.stringify(lastJsonMessage.data)}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message : null}</span>
        ))}
      </ul>
      <h1>{lastJsonMessage ? JSON.stringify(lastJsonMessage["metadata"]["message_type"]) : "nothing"}</h1>
    </div>
  );
};