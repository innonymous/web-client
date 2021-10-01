import React from 'react';

import Chat from 'innonymous/components/chat';
import Menu from 'innonymous/components/menu';
import Rooms from 'innonymous/components/rooms';
import Register from 'innonymous/components/Register';


class Composer extends React.Component {
    static maxMobileWidth = 800;

    constructor(props) {
        super(props);
        this.state = {windowWidth: window.innerWidth};
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        this.setState({windowWidth: window.innerWidth});
    }

    render() {
        // Rooms by uuid, with sorted messages.
        const rooms = {};
        // Rooms sorted by latest message.
        const sortedRooms = [];

        for (const _room of Object.values(this.props.rooms)) {
            // Copy room, make messages an array.
            const room = {..._room, messages: Object.values(_room.messages)};

            // Sort messages.
            room.messages.sort(
                (left, right) => {
                    return left.time < right.time ? 1 : -1;
                }
            );

            // Add to rooms.
            rooms[room.uuid] = room;
            sortedRooms.push(room);
        }

        // Sort rooms by latest active.
        sortedRooms.sort(
            (left, right) => {
                if (left.messages[0] === undefined) {
                    return -1;
                }

                if (right.messages[0] === undefined) {
                    return 1;
                }

                return left.messages[0].time < right.messages[0].time ? 1 : -1;
            }
        );

        if (this.state.windowWidth < Composer.maxMobileWidth) {
            return this.renderMobile(rooms, sortedRooms);
        }

        return this.renderDesktop(rooms, sortedRooms);
    }

    renderMobile(rooms, sortedRooms) {
        if (this.props.match.params.uuid && rooms[this.props.match.params.uuid]) {
            return (
                <div className={'d-flex flex-column position-absolute w-100 h-100'}>
                    <Chat
                        className={'flex-grow-1 w-100 h-100'}
                        onMessages={this.props.onMessages}
                        history={this.props.history}
                        users={this.props.users}
                        room={rooms[this.props.match.params.uuid]}
                    />
                    <Register show={this.props.location.hash === '#register'} history={this.props.history}/>
                </div>
            );
        }

        return (
            <div className={'d-flex flex-column position-absolute w-100 h-100 border-end'}>
                <Menu
                    className={'border-bottom'}
                    show={this.props.location.hash === '#menu'}
                    history={this.props.history}
                />
                <Rooms
                    className={'flex-grow-1 overflow-auto'}
                    rooms={sortedRooms}
                    users={this.props.users}
                    history={this.props.history}
                />
                <Register show={this.props.location.hash === '#register'} history={this.props.history}/>
            </div>
        );
    }

    renderDesktop(rooms, sortedRooms) {
        return (
            <div className={'d-flex flex-row position-absolute w-100 h-100'}>
                <div className={'d-flex flex-column border-end'}>
                    <Menu
                        className={'border-bottom desktop-left-panel'}
                        show={this.props.location.hash === '#menu'}
                        history={this.props.history}
                    />
                    <Rooms
                        className={'flex-grow-1 overflow-auto desktop-left-panel'}
                        rooms={sortedRooms}
                        users={this.props.users}
                        history={this.props.history}
                    />
                </div>
                {this.props.match.params.uuid && rooms[this.props.match.params.uuid] && <Chat
                    className={'flex-grow-1 h-100'}
                    onMessages={this.props.onMessages}
                    history={this.props.history}
                    users={this.props.users}
                    room={rooms[this.props.match.params.uuid]}
                />}
                <Register show={this.props.location.hash === '#register'} history={this.props.history}/>
            </div>
        );
    }
}

export default Composer;
