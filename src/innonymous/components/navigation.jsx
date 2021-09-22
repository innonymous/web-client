import 'innonymous/assets/css/navigation.css';

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Plus from 'react-bootstrap-icons/dist/icons/plus';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';

import Api from 'innonymous/utils/api';
import Register from 'innonymous/components/register';


class Navigation extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};

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

    onCreatingRequested() {
        const { cookies } = this.props;
        Api.newRoom(this.state.name, cookies.get('JWT')).then(async (response) => {
            this.setState({name: undefined});

            setTimeout(() => Api.newMessage(response.uuid, 'Room Created.', cookies.get('JWT')), 1000);
        }).catch(e => alert(e.message));
    }

    render() {
        return (
            <Navbar expand='false' className='border-bottom'>
                <Register show={this.state.requestRegister} onHide={this.onRegisterFinished.bind(this)}/>
                <Navbar.Brand>Innonymous</Navbar.Brand>
                <Navbar.Toggle aria-controls='search-form-collapse'>
                    <Plus/>
                </Navbar.Toggle>
                <Navbar.Collapse id='search-form-collapse' onClick={this.onRequestRegister.bind(this)}>
                    <Row className='m-0 p-0 d-flex flex-row mt-3'>
                        <Col className='m-0 p-0 flex-grow-1 m-1'>
                             <Form.Control
                                 type='input'
                                 placeholder='Create rooms...'
                                 value={this.state.name || ''}
                                 onChange={event => this.setState({ name: event.target.value })}
                             />
                        </Col>
                        <Col className='m-0 p-0 flex-grow-0 m-1'>
                            <Button
                                onClick={this.onCreatingRequested.bind(this)}
                                disabled={!this.state.name}>
                                    Create
                            </Button>
                        </Col>
                    </Row>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withCookies(Navigation);
