import 'innonymous/assets/css/innonymous.css';

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import update from 'immutability-helper';

import Navigation from 'innonymous/components/navigation';
import Rooms from 'innonymous/components/rooms';
import Api from 'innonymous/utils/api';
import Chat from 'innonymous/components/chat'


export default class Innonymous extends React.Component {
    constructor(props) {
        super(props);
        this.state = {rooms: {}, users: {}, activeRoom: undefined, width: window.innerWidth};
    }

    async load() {
        const rooms = {};
        for (const room of await Api.getRooms()) {
            room.messages = {};
            rooms[room.uuid] = room;
        }
        this.setState({rooms: rooms});

        // Load first messages for each room.
        for (const room of Object.values(rooms)) {
            Api.getRoomMessages(room.uuid, {limit: 10}).then(
                (messages) => this.onMessages(messages)
            ).catch(this.onError);
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize.bind(this));

        // Load rooms.
        this.load().catch(this.onError);

        // Initialize websocket.
        Api.webSocketClient.onmessage = (event) => this.onMessages([JSON.parse(event.data)]);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize.bind(this));
    }

    onError(error) {
        throw error;
    }

    onResize() {
        this.setState({width: window.innerWidth});
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

                if (state.users[message.user_uuid] === undefined && new_users[message.user_uuid] === undefined) {
                    new_users[message.user_uuid] = 1;
                    this.loadUser(message.user_uuid);
                }

                // If room does not exist locally.
                if (state.rooms[message.room_uuid] === undefined) {
                    if (spec.rooms[message.room_uuid] === undefined) {
                        this.loadRoom(message.room_uuid);
                        spec.rooms[message.room_uuid] = {$set: {messages: {}}};
                    }

                    spec.rooms[message.room_uuid].$set.messages[message.uuid] = message;

                } else {
                    if (spec.rooms[message.room_uuid] === undefined) {
                        spec.rooms[message.room_uuid] = {messages: {}};
                    }

                    spec.rooms[message.room_uuid].messages[message.uuid] = {$set: message};
                }
            }

            // Make copy with changes.
            return update(state, spec)
         });
    }

    onRoomChoose(uuid) {
        this.setState({activeRoom: uuid});
    }

    loadUser(uuid) {
        Api.getUser(uuid).then(
            (user) => this.setState(
                (state) => {
                    // Set in users.
                    const spec = {users: {}};

                    // Set in specific user.
                    spec.users[user.uuid] = {$set: user};

                    // Make copy with changes.
                    return update(state, spec)
                }
            )
        ).catch(this.onError);
    }

    loadRoom(uuid) {
        Api.getRoom(uuid).then(
            (room) => this.setState(
                (state) => {
                    // Merge in rooms.
                    const spec = {rooms: {}};

                    // Merge in specific room.
                    spec.rooms[room.uuid] = {$merge: room};

                    // Make copy with changes.
                    return update(state, spec)
                }
            )
        ).catch(this.onError);
    }

    renderChat() {
        if (this.state.activeRoom === undefined) {
            return;
        }

        return (
            <Col className='m-0 p-0 h-100'>
                <Chat
                    room={this.state.rooms[this.state.activeRoom]}
                    users={this.state.users}
                    onClick={this.onRoomChoose.bind(this)}
                />
            </Col>
        )
    }

    render() {
        // Mobile.
        if (this.state.width <= 800) {
            const chat = this.renderChat();

            if (chat) {
                return (
                    <div className='m-0 p-0 vw-100 vh-100 d-flex flex-column'>
                        {chat}
                    </div>
                );
            }

            return (
                <div className='m-0 p-0 vh-100 vw-100 d-flex flex-column'>
                    <Row className='m-0 p-0'>
                        <Navigation/>
                    </Row>
                    <Row className='m-0 p-0 overflow-scroll flex-grow-1'>
                        <Rooms
                            users={this.state.users}
                            rooms={this.state.rooms}
                            onRoomChoose={this.onRoomChoose.bind(this)}
                        />
                    </Row>
                </div>
            );
        }

        // Desktop.
        return (
            <Row className='m-0 p-0 vw-100 vh-100'>
                <Col className='left-menu m-0 p-0 h-100 d-flex flex-column border-end'>
                    <Row className='m-0 p-0'>
                        <Navigation/>
                    </Row>
                    <Row className='m-0 p-0 overflow-scroll flex-grow-1'>
                        <Rooms
                            users={this.state.users}
                            rooms={this.state.rooms}
                            onRoomChoose={this.onRoomChoose.bind(this)}
                        />
                    </Row>
                </Col>
                {this.renderChat()}
            </Row>
        );
    }
}
