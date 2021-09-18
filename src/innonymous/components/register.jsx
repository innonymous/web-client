import 'innonymous/assets/css/navigation.css';

import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Api from 'innonymous/utils/api';


export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {name: undefined}
    }

    onRegisterPressed() {
        if (this.state.captcha === undefined){
            Api.newUser(this.state.name).then(response => {
                this.setState({captcha: response.captcha, create_token: response.create_token});
            }).catch(e => {
                    alert(e.message)
                }
            );

            return;
        }

        Api.newUserConfirm(this.state.captcha_value, this.state.create_token).then(response => {
           this.props.onHide(response);
        }).catch(e => {
                alert(e.message)
            }
        );
    }

    render() {
        let form = '';
        if (this.state.captcha === undefined) {
            form = (
                <FloatingLabel controlId="floatingInput" label="Name">
                    <Form.Control
                        value={this.state.name || ''}
                        onChange={event => this.setState({ name: event.target.value })}
                        placeholder="Lover337"
                    />
                </FloatingLabel>
            );
        } else {
            form = (
                <div>
                    <img className='m-3' src={`data:image/jpeg;base64,${this.state.captcha}`}  alt='Captcha'/>
                    <FloatingLabel controlId="floatingInput" label="Captcha">
                        <Form.Control
                            value={this.state.captcha_value || ''}
                            onChange={event => this.setState({ captcha_value: event.target.value })}
                            placeholder="Lover337"
                        />
                    </FloatingLabel>
                </div>
            );
        }

        return (
            <Modal show={this.props.show} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
                <Modal.Header closeButton onHide={ () => {
                        this.setState({captcha: undefined});
                        this.props.onHide();
                    }
                }>
                    <Modal.Title id='contained-modal-title-vcenter'>
                        Register
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {form}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={this.onRegisterPressed.bind(this)}
                        disabled={(!this.state.captcha_value && this.state.captcha) || !this.state.name}>
                            {this.state.captcha === undefined ? 'Register':'Confirm'}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
