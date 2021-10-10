import React from 'react';

import Room from 'innonymous/components/rooms/Room';


class Rooms extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                {this.props.rooms.map(
                    (room, index) => {
                        return (
                            <Room
                                room={room}
                                key={index}
                                users={this.props.users}
                                history={this.props.history}
                            />
                        );
                    }
                )}
            </div>
        );
    }
}

export default Rooms;
