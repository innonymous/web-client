import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import 'innonymous/assets/css/register.css';
import Api from 'innonymous/Api';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';


class Register extends React.Component {
    static nameRegex = /^[\p{Letter}0-9][\p{Letter}0-9\-_\s]{0,30}[\p{Letter}0-9]$/u;
    static goodNameMessage = 'Great name :3';
    static nameRestrictionsMessage = '2-32 characters (A-z, 0-9, _, -)';
    static propTypes = {cookies: instanceOf(Cookies).isRequired};

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameValidation: {
                isValid: false,
                message: Register.nameRestrictionsMessage
            },
            captchaImage: null,
            captchaValue: '',
            isCaptchaInvalid: false,
            createToken: null
        };
    }

    onSubmit(event) {
        event.preventDefault();

        // Request captcha to confirm.
        if (this.state.captchaImage === null) {
            this.requestCaptcha();
            return;
        }

        Api.newUserConfirm(this.state.captchaValue, this.state.createToken).then(
            this.onRegisterFinished.bind(this)
        ).catch(
            () => {
                this.requestCaptcha();
                this.setState({isCaptchaInvalid: true});
            }
        );
    }

    onRegisterFinished(response) {
        this.props.cookies.set('uuid', response.uuid);
        this.props.cookies.set('accessToken', response.access_token);
        this.props.history.goBack();
    }

    onNameChanged(event) {
        const state = {name: event.target.value.trimStart()};

        if (state.name.match(Register.nameRegex) === null) {
            state.nameValidation = {isValid: false, message: Register.nameRestrictionsMessage};
        } else {
            state.nameValidation = {isValid: true, message: Register.goodNameMessage};
        }

        this.setState(state);
    }

    requestCaptcha() {
        if (!this.state.nameValidation.isValid) {
            return;
        }

        Api.newUser(this.state.name.trim()).then(
            (response) => {
                this.setState({
                    captchaImage: response.captcha,
                    createToken: response.create_token
                });
            }
        );
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={() => this.props.history.goBack()}
                backdrop={'static'}
                keyboard={false}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Form autoComplete={'off'} onSubmit={this.onSubmit.bind(this)}>
                    <Modal.Body>
                        <Form.Group className={'mb-3'} controlId={'name'}>
                            <Form.Label>Name/Nickname</Form.Label>
                            <Form.Control
                                type={'text'}
                                required={true}
                                placeholder={'f3line'}
                                value={this.state.name}
                                onChange={this.onNameChanged.bind(this)}
                                isValid={this.state.nameValidation.isValid}
                                isInvalid={!this.state.nameValidation.isValid}
                                disabled={this.state.captchaImage}
                            />
                            <Form.Control.Feedback type={this.state.nameValidation.isValid ? 'valid' : 'invalid'}>
                                {this.state.nameValidation.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {this.state.captchaImage && this.renderCaptcha()}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type={'submit'}
                            variant={'outline-primary'}
                            disabled={!this.state.nameValidation.isValid}
                        >
                            {this.state.captchaImage ? 'Confirm' : 'Register'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }

    renderCaptcha() {
        return (
            <Form.Group className={'mb-3'} controlId={'captcha'}>
                <Form.Label>
                    <Image
                        className={'captcha-image'}
                        rounded={true}
                        src={`data:image/jpeg;base64,${this.state.captchaImage}`}
                        alt={'Captcha'}
                    />
                </Form.Label>
                <Form.Control
                    type={'text'}
                    required={true}
                    placeholder={'TheVeryHardCaptcha'}
                    value={this.state.captchaValue}
                    onChange={
                        (event) => {
                            this.setState({captchaValue: event.target.value, isCaptchaInvalid: false});
                        }
                    }
                    isInvalid={this.state.isCaptchaInvalid}
                />
                <Form.Text className={'text-muted'}>
                    - Are you human?<br/>- I am not a robot.
                </Form.Text>
            </Form.Group>
        );
    }
}

export default withCookies(Register);
