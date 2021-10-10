import ReconnectingWebSocket from 'reconnecting-websocket';

class Api {
    static url = process.env.REACT_APP_API_URL || window.API_URL;
    static webSocketClient = new ReconnectingWebSocket(
        Api.getWebSocketUrl(), [], {
            connectionTimeout: 500,
            minReconnectionDelay: 500,
            maxReconnectionDelay: 1000
        }
    );

    static async getRoom(uuid) {
        return await Api.request('rooms/' + uuid);
    }

    static async getRooms() {
        return (await Api.request('rooms')).rooms;
    }

    static async newRoom(name, token) {
        return await Api.request(
            'rooms/new', {}, {name: name}, token
        );
    }

    static async getRoomMessages(uuid, params) {
        return (await Api.request(
            'rooms/' + uuid + '/messages', params
        )).messages;
    }

    static async getUser(uuid) {
        return await Api.request('users/' + uuid);
    }

    static async newUser(name) {
        return await Api.request('users/new', {}, {name: name})
    }

    static async newUserConfirm(captcha, create_token) {
        return await Api.request('users/new/confirm', {},
            {captcha: captcha, create_token: create_token}
        )
    }

    static async newMessage(room, data, token) {
        return await Api.request(
            'rooms/' + room + '/messages/new', {}, {type: 'text', data: data}, token
        )
    }

    static async request(endpoint, params, data, auth) {
        const method = data ? 'POST' : 'GET';

        const response = await fetch(
            Api.makeUrl(endpoint, params),
            {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth
                },
            }
        );

        if (!response.ok) {
            throw Error(JSON.stringify((await response.json()).detail|| response.statusText));
        }

        return await response.json();
    }

    static makeUrl(path, params) {
        const url = new URL(Api.url);

        for (const [key, value] of Object.entries(params || {})) {
            url.searchParams.append(key, value);
        }

        // Setup path.
        url.pathname += path;

        return url.toString();
    }

    static getWebSocketUrl() {
        const url = new URL(Api.makeUrl('messages/updates'));

        // Secure.
        url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';

        return url.toString();
    }
}

export default Api;
