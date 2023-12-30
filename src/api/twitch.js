import axios from 'axios';
import config from '../config/config';


export const getBroadcasterID = (username, token) => {
    return axios.get('https://api.twitch.tv/helix/users', {
        params: {
          login: username
        },
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + token,
            "Client-Id": config.app_id
        }
    })
    .then((res) => {
        console.log(res.data);
        return res.data;
    })
    .catch((error) => {
        console.error(error);
        throw error;
    })
};

export const getOAuthToken = (app_id, app_secret) => {
    return axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: app_id,
        client_secret: app_secret,
        grant_type: 'client_credentials'
    })
    .then((res) => {
        console.log(res);
        return res.data;
    })
    .catch((error) => {
        console.error(error);
        throw error;
    })
};

export const validateToken = (token) => {
    return axios.get('https://id.twitch.tv/oauth2/validate', {
        headers: {
            "Authorization": "OAuth " + token
        }
    })
    .then((res) => {
        console.log('validate res: ', res);
        return res;

    })
    .catch((err) => {
        console.error(err);
        throw err;
    })
};

export const callEventSub = (
    type, 
    version, 
    condition, 
    transport,
    subscriberID,
    socketID
    ) => {
    return axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
        "type": type,
        "version": version,
        "condition": condition,
        "transport": {
            "method": "websocket",
            "session_id": socketID
        },
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
            "Client-Id": config.app_id
        }
    })
    .then(() => {
        
    })
    .catch(() => {

    })

};