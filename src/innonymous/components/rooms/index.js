import React from 'react';

import Container from 'react-bootstrap/Container';

import Room from 'innonymous/components/rooms/room.js';


class Rooms extends React.Component {
    render() {
        let rooms = []

        for (let i = 0; i < 12; ++i) {
            let room = <Room
                name={'Test room'}
                user={'The cat'}
                message={'Hello!'}
                active={'27 Aug'}
                unread={9}
            />

            rooms.push(
                room
            );
        }

        return (
            <Container {...this.props} className={'rooms ' + this.props.className}>
                {rooms}
            </Container>
        );
    }
}

export default Rooms;
