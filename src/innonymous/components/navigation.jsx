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


class Navigation extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
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
                <Navbar.Brand>Innonymous</Navbar.Brand>
                <Navbar.Toggle aria-controls='search-form-collapse'>
                    <Plus/>
                </Navbar.Toggle>
                <Navbar.Collapse id='search-form-collapse'>
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
