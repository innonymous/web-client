import 'innonymous/assets/css/chat/chat.css';

import React from 'react';

import ToastContainer from 'react-bootstrap/ToastContainer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Placeholder from 'react-bootstrap/Placeholder';
import ArrowLeft from 'react-bootstrap-icons/dist/icons/arrow-left';

import Message from 'innonymous/components/chat/message';
import Input from "innonymous/components/chat/input";


export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.messagesEndRef = React.createRef();
    }

    componentDidMount() {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end'});
    }

    componentDidUpdate() {
        this.messagesEndRef.current.scrollIntoView({ block: 'end'});
    }

    render() {
        if (this.props.room === undefined) {
            return (
                <Container className='chat mt-5 m-0 p-0 w-100 h-100 d-flex flex-column'>
                    <Row className='m-0 p-0'>
                        <Navbar expand='false' className='border-bottom'>
                            <Placeholder as={Navbar.Brand} animation='wave'>
                                <Placeholder className='room-name-placeholder'/>
                            </Placeholder>
                        </Navbar>
                    </Row>
                    <Row className='m-0 p-0 flex-grow-1'>
                        <ToastContainer className='messages'>

                        </ToastContainer>
                    </Row>
                </Container>
            );
        }

        const raw_messages = Object.values(this.props.room.messages).sort(
            (left, right) => left.time > right.time ? 1 : -1
        );

        const messages = [];
        for (const message of raw_messages) {
            const user = this.props.users[message.user_uuid];

            let position = 'left';
            if (this.props.user !== undefined && this.props.user.uuid === message.user_uuid) {
                position = 'right';
            }

            messages.push(<Message
                key={message.uuid}
                message={message}
                user={user}
                position={position}
            />)
        }

        return (
            <Container className='chat m-0 p-0 w-100 h-100 d-flex flex-column' fluid>
                <Row className='m-0 p-0'>
                    <Navbar expand='false' className='border-bottom' fixed='top' bg='light'>
                        <Navbar.Brand>
                            <ArrowLeft className='me-3' onClick={() => this.props.onClick()}/>{this.props.room.name}
                        </Navbar.Brand>
                    </Navbar>
                </Row>
                <Row className='m-0 p-0 flex-grow-1 overflow-scroll'>
                    <Container className='messages w-100 h-100 overflow-scroll'>
                        {messages}
                        <div ref={this.messagesEndRef} id='latest-s' />
                    </Container>
                </Row>
                <Row className='m-0 p-3 border-top'>
                    <Input room={this.props.room.uuid}/>
                </Row>
            </Container>
        );
    }
}
