import React from 'react';

import {Redirect, Route, Switch} from 'react-router-dom';
import update from 'immutability-helper';

import 'innonymous/assets/css/innonymous.css';
import Api from 'innonymous/Api';
import Composer from 'innonymous/Composer';


class Innonymous extends React.Component {
    constructor(props) {
        super(props);

        let rooms = {};
        let users = {};

        try {
            rooms = JSON.parse(sessionStorage.getItem('rooms')) || {}
            users = JSON.parse(sessionStorage.getItem('users')) || {}

            for (const room of Object.values(rooms)) {
                for (const message of Object.values(room.messages)) {
                    message.time = new Date(message.time);
                }
            }

        } catch (exc) {
            console.log('Cannot read cache.', exc);
        }

        this.state = {rooms: rooms, users: users};
    }

    componentDidMount() {
        // Load rooms.
        this.loadGeneralInfo();

        // Initialize websocket.
        Api.webSocketClient.onmessage = (event) => this.onMessages([JSON.parse(event.data)]);
        Api.webSocketClient.reconnect();
    }

    componentWillUnmount() {
        Api.webSocketClient.close();
    }

    async loadGeneralInfo() {
        for (const room of await Api.getRooms()) {
            Api.getRoomMessages(room.uuid, {limit: 10}).then(
                this.onMessages.bind(this)
            );
        }
    }

    loadUser(uuid) {
        Api.getUser(uuid).then(
            (user) => {
                this.setState(
                    (state) => {
                        // Set in users.
                        const spec = {users: {}};

                        // Set in specific user.
                        spec.users[user.uuid] = {$set: user};

                        // Make copy with changes.
                        return update(state, spec)
                    }, () => {
                        sessionStorage.setItem('users', JSON.stringify(this.state.users));
                    }
                );
            }
        );
    }

    loadRoom(uuid) {
        Api.getRoom(uuid).then(
            (room) => {
                this.setState(
                    (state) => {
                        // Merge in rooms.
                        const spec = {rooms: {}};

                        // Merge in specific room.
                        spec.rooms[room.uuid] = {$merge: room};

                        // Make copy with changes.
                        return update(state, spec)
                    }, () => {
                        sessionStorage.setItem('rooms', JSON.stringify(this.state.rooms));
                    }
                );
            }
        );
    }

    onMessages(messages) {
        if (messages.length === 0) {
            return;
        }

        this.setState((state) => {
            // Merge in users.
            const spec = {rooms: {}};
            const new_users = {}

            for (const message of messages) {
                message.time = new Date(message.time);

                // If user does not exist locally.
                if (!(state.users[message.user_uuid] && state.users[message.user_uuid].name) && new_users[message.user_uuid] === undefined) {
                    // Set flag, that we requested info about this user.
                    new_users[message.user_uuid] = true;
                    // Request info.
                    this.loadUser(message.user_uuid);
                }

                // If room does not exist locally.
                if (!(state.rooms[message.room_uuid] && state.rooms[message.room_uuid].name)){
                    // If it is a first message in current loop for the room.
                    if (spec.rooms[message.room_uuid] === undefined) {
                        // Create new room.
                        spec.rooms[message.room_uuid] = {$set: {messages: {}}};
                        // Request info.
                        this.loadRoom(message.room_uuid);
                    }
                    // Add message to the room.
                    spec.rooms[message.room_uuid].$set.messages[message.uuid] = message;

                } else {
                    // If it is a first message in current loop for the room.
                    if (spec.rooms[message.room_uuid] === undefined) {
                        // Create new room.
                        spec.rooms[message.room_uuid] = {messages: {}};
                    }
                    // Add message to the room.
                    spec.rooms[message.room_uuid].messages[message.uuid] = {$set: message};
                }
            }

            // Make copy with changes.
            return update(state, spec)
         }, () => {
            sessionStorage.setItem('rooms', JSON.stringify(this.state.rooms));
        });
    }

    render() {
        return (
            <Switch>
                <Route
                    exact={true}
                    path={['/rooms', '/rooms/:uuid']}
                    render={
                        (props) => {
                            return (
                                <Composer
                                    {...props}
                                    onMessages={this.onMessages.bind(this)}
                                    rooms={this.state.rooms}
                                    users={this.state.users}/>
                            );
                        }}
                />
                <Redirect from={'/'} to={'/rooms'}/>
            </Switch>
        );
    }
}

export default Innonymous;
