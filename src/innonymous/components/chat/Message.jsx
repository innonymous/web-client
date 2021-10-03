import React from 'react';

import Toast from 'react-bootstrap/Toast';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import Placeholder from "react-bootstrap/Placeholder";

import 'innonymous/assets/css/chat/message.css';


class Message extends React.Component {
    static propTypes = {cookies: instanceOf(Cookies).isRequired};

    render() {
        const currentUser = this.props.cookies.get('uuid');

        return (
            <Toast
                className={(currentUser === this.props.message.user_uuid ? 'ms-auto' : 'me-auto') + ' mb-3'}
            >
                <Toast.Header className={'d-flex flex-row justify-content-between'} closeButton={false}>
                    {this.renderUserName()}
                    <small className='text-muted align-content-end'>
                        {this.renderTime()}
                    </small>
                </Toast.Header>
                <Toast.Body className={'message-data'}>
                    {this.props.message.data}
                </Toast.Body>
            </Toast>
        );
    }

    renderUserName() {
        if (this.props.user === undefined) {
            return (
                <Placeholder animation='wave'>
                    <Placeholder className={'name-placeholder'}/>
                </Placeholder>
            );
        }

        return (
            <strong className="me-auto">
                {this.props.user.name}
            </strong>
        );
    }

    renderTime() {
        // Time of the message.
        const time = this.props.message.time
        // Difference in days.
        const difference = (new Date() - time) / 1000 / 3600 / 24;
        // Time.
        const formattedTime = time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

        // More than year.
        if (difference > 365) {
            return time.toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            }) + ', ' + formattedTime;
        }

        // More than week.
        if (difference > 7) {
            return time.toLocaleDateString(undefined, {
                month: 'short', day: 'numeric'
            }) + ', ' + formattedTime;
        }

        // More than day.
        if (difference > 1) {
            return time.toLocaleDateString(undefined, {
                weekday: 'long'
            }) + ', ' + formattedTime;
        }

        // Less a day.
        return formattedTime;
    }
}

export default withCookies(Message);
