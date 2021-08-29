import 'innonymous/assets/css/rooms/room.css'

import React from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


class Room extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            user: props.user,
            message: props.message,
            active: props.active,
            unread: props.unread
        };
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title>
                                {this.state.name}
                            </Card.Title>
                            <Card.Subtitle className='text-muted'>
                                {this.state.user}
                            </Card.Subtitle>
                            <Card.Text>
                                {this.state.message}
                            </Card.Text>
                        </Col>
                        <Col className='text-end col-5'>
                            <Card.Text>
                                {this.state.active}
                            </Card.Text>
                            <span className="badge bg-info">
                                {this.state.unread}
                            </span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }
}

export default Room;
