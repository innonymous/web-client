import 'innonymous/assets/css/chat/input.css';

import React from 'react';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {instanceOf} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';

import Api from 'innonymous/utils/api';
import Register from 'innonymous/components/register';


class Input extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = props;
        this.state = {JWT: cookies.get('JWT')};
    }

    onRequestRegister() {
        if (this.state.JWT !== undefined) {
            return;
        }

        this.setState({requestRegister: true})
    }

    onRegisterFinished(response) {
        this.setState({requestRegister: false})

        if (response === undefined) {
            return;
        }

        const { cookies } = this.props;
        cookies.set('JWT', response.access_token);

        this.setState({JWT: cookies.get('JWT')});
    }

    onSendRequested() {
        Api.newMessage(this.props.room, this.state.message, this.state.JWT).then(
            () => this.setState({message: ''})
        ).catch(
            e => alert(e.message)
        );
    }

    render() {
        const jwt = this.state.JWT === undefined;

        return (
            <Row className='m-0 p-0 d-flex flex-row'>
                <Register show={this.state.requestRegister} onHide={this.onRegisterFinished.bind(this)}/>

                <Col className='m-0 p-0 flex-grow-1' onClick={this.onRequestRegister.bind(this)}>
                    <FloatingLabel controlId='floatingTextarea' label='Message' className='m-0 p-0'>
                        <Form.Control
                            className='message-form'
                            as='textarea'
                            placeholder='Leave a message here'
                            value={this.state.message || ''}
                            onChange={event => this.setState({ message: event.target.value })}
                            disabled={jwt}
                        />
                    </FloatingLabel>
                </Col>
                <Col className='m-0 p-0 d-flex align-items-end flex-grow-0'>
                    <Button
                        className='ms-3 me-3'
                        variant='outline-info'
                        disabled={jwt || !this.state.message}
                        onClick={this.onSendRequested.bind(this)}>
                        Send
                    </Button>
                </Col>
            </Row>
        )
    }
}

export default withCookies(Input);
