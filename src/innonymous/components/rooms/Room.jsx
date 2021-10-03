import React from 'react';

import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

import 'innonymous/assets/css/rooms/room.css';


class Room extends React.Component {
    static selectRoomDelay = 100;

    constructor(props) {
        super(props);
        this.state = {isSelectedRequested: false};
    }

    isSelected() {
        return this.props.history.location.pathname.includes(this.props.room.uuid);
    }

    requestSelect() {
        // Requested.
        this.setState({isSelectedRequested: true});

        // Make a transition after selectRoomDelay milliseconds.
        setTimeout(
            () => {
                // We make a transition.
                this.setState({isSelectedRequested: false});
                this.props.history.push(`/rooms/${this.props.room.uuid}`)
            },
            Room.selectRoomDelay
        );
    }

    render() {
        return (
            <Card
                onClick={() => {this.requestSelect()}}
                className={this.state.isSelectedRequested || this.isSelected() ? 'selected' : ''}
            >
                <Card.Body>
                    <div className={'d-flex flex-row justify-content-between'}>
                        <div className={'d-flex flex-column text-truncate'}>
                            {this.renderName()}
                            {this.renderLastUser()}
                            {this.renderLastMessage()}
                        </div>
                        <div className={'d-flex flex-column text-end time'}>
                            {this.renderTime()}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    renderName() {
        if (this.props.room === undefined || this.props.room.name === undefined) {
            return (
                <Placeholder as={Card.Title} animation='wave'>
                    <Placeholder className={'name-placeholder'}/>
                </Placeholder>
            );
        }

        return (
            <Card.Title className={'text-truncate'}>
                {this.props.room.name}
            </Card.Title>
        );
    }

    renderTime() {
        if (this.props.room === undefined || this.props.room.messages === undefined) {
            return (
                <Placeholder animation='wave'>
                    <Placeholder className={'time-placeholder'}/>
                </Placeholder>
            );
        }

        // No messages.
        if (this.props.room.messages.length === 0) {
            return '';
        }

        // Time of the message.
        const time = this.props.room.messages[0].time
        // Difference in days.
        const difference = (new Date() - time) / 1000 / 3600 / 24;

        // More than year.
        if (difference > 365) {
            return time.toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }

        // More than week.
        if (difference > 7) {
            return time.toLocaleDateString(undefined, {
                month: 'short', day: 'numeric'
            });
        }

        // More than day.
        if (difference > 1) {
            return time.toLocaleDateString(undefined, {
                weekday: 'long'
            });
        }

        // Less a day.
        return time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    renderLastUser() {
        const placeholder = (
            <Placeholder as={Card.Subtitle} className={'mb-2 text-muted'} animation={'wave'}>
               <Placeholder className={'last-user-placeholder'}/>
            </Placeholder>
        );

        // No room or undefined messages.
        if (this.props.room === undefined || this.props.room.messages === undefined) {
            return placeholder;
        }

        // No messages.
        if (this.props.room.messages.length === 0) {
            return (
                <Card.Subtitle className={'mt-2 text-muted'}>
                    No messages
                </Card.Subtitle>
            );
        }

        // User info.
        const user = this.props.users[this.props.room.messages[0].user_uuid];

        // User not loaded yet.
        if (user === undefined) {
            return placeholder
        }

        return (
            <Card.Subtitle className={'mb-2 text-muted text-truncate'}>
                {user.name}
            </Card.Subtitle>
        );
    }

    renderLastMessage() {
        if (this.props.room === undefined || this.props.room.messages === undefined) {
            return (
                <Placeholder as={Card.Text} animation={'wave'}>
                    <Placeholder className={'last-message-placeholder'}/>
                </Placeholder>
            );
        }

        // No messages.
        if (this.props.room.messages.length === 0) {
            return '';
        }

        return (
           <Card.Text className={'text-truncate'}>
               {this.props.room.messages[0].data}
           </Card.Text>
        );
    }
}

export default Room;
