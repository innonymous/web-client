import 'innonymous/assets/css/rooms/room.css'

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Badge from 'react-bootstrap/Badge';


export default class Room extends React.Component {
    renderName() {
        if (this.props.room === undefined || this.props.room.name === undefined) {
            return (
                <Placeholder as={Card.Title} animation='wave'>
                    <Placeholder xs={10}/>
                </Placeholder>
            )
        }

        return (
            <Card.Title>
                {this.props.room.name}
            </Card.Title>
        )
    }

    renderInfo() {
        if (this.props.room === undefined) {
            return (
                <div>
                    <Placeholder as={Card.Text} animation='wave'>
                        <Placeholder xs={6}/>
                    </Placeholder>
                    <Placeholder as={Badge} animation='wave' className='badge bg-info'>
                        <Placeholder/>
                    </Placeholder>
                </div>
            )
        }

        // No messages.
        if (Object.keys(this.props.room.messages).length === 0) {
            return;
        }

        // Sent time.
        const date = Object.values(this.props.room.messages).reduce(
            (left, right) => left.time > right.time ? left : right
        ).time;

        return (
            <div>
                <Card.Text className='fw-light lh-1 m-1'>
                    {date.toDateString()} {date.toLocaleTimeString()}
                </Card.Text>
                {/*<span className='badge bg-info'>*/}
                {/*    {this.state.unread}*/}
                {/*</span>*/}
            </div>
        )
    }

    renderLastMessage() {
        // Just placeholder.
        if (this.props.room === null) {
            return (
                <div>
                    <Placeholder as={Card.Subtitle} className='text-muted' animation='wave'>
                        <Placeholder xs={8}/>
                    </Placeholder>
                    <Placeholder as={Card.Text} animation='wave'>
                        <Placeholder xs={12}/>
                    </Placeholder>
                </div>
            )
        }

        // No messages.
        if (Object.keys(this.props.room.messages).length === 0) {
            return (
                <div>
                    <Card.Subtitle className='text-muted'>
                        No messages
                    </Card.Subtitle>
                </div>
            )
        }


        const message = Object.values(this.props.room.messages).reduce(
            (left, right) => left.time > right.time ? left : right
        );


        // User not loaded.
        if (this.props.users[message.user_uuid] === undefined) {
            return (
                <div>
                    <Placeholder as={Card.Subtitle} className='text-muted' animation='wave'>
                        <Placeholder xs={8}/>
                    </Placeholder>
                    <Card.Text>
                        {message.data}
                    </Card.Text>
                </div>
            )
        }


        return (
            <div>
                <Card.Subtitle className='text-muted'>
                    {this.props.users[message.user_uuid].name}
                </Card.Subtitle>
                <Card.Text>
                    {message.data}
                </Card.Text>
            </div>
        )
    }

    render() {
        return (
            <Card onClick={() => this.props.onClick(this.props.room.uuid)}>
                <Card.Body>
                    <Row>
                        <Col>
                            {this.renderName()}
                            {this.renderLastMessage()}
                        </Col>
                        <Col className='text-end col-5'>
                            {this.renderInfo()}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }
}
