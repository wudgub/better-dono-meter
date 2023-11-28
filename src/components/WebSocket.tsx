import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
const axios = require('axios').default;

import config from '../config/config';



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


  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);

  // get broadcaster ID. Run 
  const getBroadcasterID = (username) => {
    // axios call here to get broadcaster id
    axios.get('https://api.twitch.tv/helix/users', {
      params: {
        login: username
      }
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        console.log('user call done');
      })
  };

  function getOAuthToken() {
    //axios call to get oauth token 
    let token = config.app_token;
    let secret = config.app_secret;
  };



  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastJsonMessage['metadata']['message_type']));
      switch (lastJsonMessage["metadata"]["message_type"]) {
        case "session_welcome":
            setSocketID(lastJsonMessage["payload"]["session"]["id"]);
            console.log("socket ID set: ", lastJsonMessage["payload"]["session"]["id"]);
            //TODO: figure out to to sub to EventSub here...
            break;
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
    if (socketID !== null) {
      // if already subscribed, just move on.
      if (subEnabled) {
        console.log("sub already enabled.");
      } else {
        if(broadcasterID == null) {
          // call getbroadcasterID
          console.log('get broadcasterID')
        }
        let eventSub = {
          "type": "channel.update",
          "version": "2",
          "condition": {
            "broadcaster_user_id": ""
          },
          "transport": {
            "method": "websocket",
            "session_id": socketID
          }
        };
        console.log(JSON.stringify(eventSub));
      };
    } else {
      console.log("socketID is null");
    }
  }, [socketID]);

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