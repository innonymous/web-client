import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';
import {ArrowLeft} from 'react-bootstrap-icons';
import Spinner from 'react-bootstrap/Spinner';

import 'innonymous/assets/css/chat/chat.css'
import Input from 'innonymous/components/chat/Input';
import Message from 'innonymous/components/chat/Message';
import Api from 'innonymous/Api';


class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newMessagesRequested: false};
    }

    onMessagesScroll(event) {
        this.setState(
            (state) => {
                // Already requested.
                if (state.newMessagesRequested) {
                    return;
                }

                // If container not scrolled enough.
                if (event.target.scrollHeight > event.target.clientHeight + Math.abs(event.target.scrollTop) + 1) {
                    return;
                }

                // No messages.
                if (this.props.room.messages.length === 0) {
                    return;
                }

                // Get oldest message timestamp.
                const oldestMessage = this.props.room.messages.at(-1).time.toISOString();

                // Request more messages.
                Api.getRoomMessages(this.props.room.uuid, {limit: 10, before: oldestMessage}).then(
                    this.props.onMessages
                ).then(
                    () => {
                        setTimeout(() => this.setState({newMessagesRequested: false}), 1000);
                    }
                ).catch(
                    (exc) => {
                        setTimeout(() => this.setState({newMessagesRequested: false}), 1000);
                        throw exc;
                    }
                );

                return {newMessagesRequested: true};
            }
        );
    }

    render() {
        return (
            <div className={'d-flex flex-column justify-content-between ' + this.props.className}>
                <Navbar className={'border-bottom'} expand={'false'}>
                    <Container className={'justify-content-start'} fluid={true}>
                        <Navbar.Toggle onClick={() => this.props.history.push('/rooms')}>
                            <ArrowLeft className={'back-image'}/>
                        </Navbar.Toggle>
                        {this.renderName()}
                    </Container>
                </Navbar>
                <Container
                    className={'d-flex flex-column-reverse flex-grow-1 overflow-auto pt-3'}
                    onScrollCapture={this.onMessagesScroll.bind(this)}
                    fluid={true}
                >
                    {this.props.room.messages.map(
                        (message, index) => {
                            return (
                                <Message key={index} message={message} user={this.props.users[message.user_uuid]}/>
                            );
                        }
                    )}
                    {this.state.newMessagesRequested &&
                        <div className={'d-flex flex-row justify-content-center mb-2'}>
                            <Spinner className={'mt-1 me-1'} size={'sm'} animation={'border'}/>Loading...
                        </div>
                    }
                </Container>
                <Input roomUuid={this.props.room.uuid} history={this.props.history}/>
            </div>
        );
    }

    renderName() {
        if (this.props.room === undefined || this.props.room.name === undefined) {
            return (
                <Placeholder as={Navbar.Brand} className={'ms-3'} animation='wave'>
                    <Placeholder className={'name-placeholder'}/>
                </Placeholder>
            );
        }

        return (
            <Navbar.Brand className={'ms-3'}>
                {this.props.room.name}
            </Navbar.Brand>
        );
    }
}

export default Chat;
