import React from 'react';

import Container from 'react-bootstrap/Container';

import Room from 'innonymous/components/rooms/room.js';

import { backendUrl } from 'innonymous/config.js'


class Rooms extends React.Component {
    constructor() {
        super(null);

        this.state = {
            data: {}, 
            isFetching: true, 
            error: null
        }
    }

    componentWillMount() {
        fetch(backendUrl + '/rooms/')
            .then(response => response.json())
            .then(result => this.setState({data: result, isFetching: false}))
            .catch(e => {
              console.log(e);
              this.setState({isFetching: false, error: e })
            });
    }

    render() {
        if (this.state.isFetching) {
            return "...Loading"
        }
        if (this.state.error) {
            return "error"
        }

        let rooms = [];
        this.state.data.rooms.forEach(
            function (room, i, array) {
                let rendered_room = <Room
                    name={room.name}
                    user={'The cat'}
                    message={'Hello!'}
                    active={'27 Aug'}
                    unread={9}
                />

            rooms.push(rendered_room);
            }
        )

        return (
            <Container {...this.props} className={'rooms ' + this.props.className}>
                {rooms}
            </Container>
        );
    }
}

export default Rooms;
