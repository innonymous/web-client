import 'innonymous/assets/css/rooms/rooms.css';

import React from 'react';
import Container from 'react-bootstrap/Container';

import Room from 'innonymous/components/rooms/room';


export default class Rooms extends React.Component {
    render() {
        const rooms = [];

        if (this.props.rooms.length === 0) {
            for (let i = 0; i < 5; ++i) {
                rooms.push(<Room key={i}/>);
            }
        } else {
            const raw_rooms = Object.values(this.props.rooms).sort(
                (left_room, right_room) => {
                    const left = Object.values(left_room.messages).sort(
                        (left_message, right_message) => left_message.time > right_message.time ? 1 : -1
                    )[0];

                    const right = Object.values(right_room.messages).sort(
                        (left_message, right_message) => left_message.time > right_message.time ? 1 : -1
                    )[0];

                    if (left === undefined) {
                        return 1;
                    }

                    if (right === undefined) {
                        return -1;
                    }

                    return left.time > right.time ? -1 : 1;
                }
            );

            for (const room of raw_rooms) {
                rooms.push(
                    <Room
                        key={room.uuid}
                        room={room}
                        users={this.props.users}
                        onClick={this.props.onRoomChoose || ((uuid) => {console.log(uuid)})}
                    />
                );
            }
        }

        return (
            <Container className='rooms m-0 p-0 overflow-scroll'>
                {rooms}
            </Container>
        );
    }
}
