import 'innonymous/assets/css/chat/message.css';

import React from 'react';

import Toast from 'react-bootstrap/Toast';


export default class Message extends React.Component {
    renderName() {
        if (this.props.user === undefined) {
            return '';
        }

        return (
            <strong className="me-auto">
                {this.props.user.name}
            </strong>
        );
    }

    renderTime() {
        if (this.props.message === undefined) {
            return '';
        }

        const time = this.props.message.time;

        return (
            <small className='text-muted align-content-end'>
                {time.toDateString()} {time.toLocaleTimeString()}
            </small>
        )
    }

    renderData() {
        if (this.props.message === undefined) {
            return '';
        }

        return this.props.message.data
    }

    render() {
        return (
            <Toast className={(this.props.position || 'left') + '-message'}>
                <Toast.Header closeButton={false}>
                    {this.renderName()}
                    {this.renderTime()}
                </Toast.Header>
                <Toast.Body>
                    {this.renderData()}
                </Toast.Body>
            </Toast>
        );
    }
}
