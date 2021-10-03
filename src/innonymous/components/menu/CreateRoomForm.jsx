import React from 'react';

import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";
import Api from "../../Api";


class CreateRoomForm extends React.Component {
    static nameRegex = /^[\p{Letter}0-9][\p{Letter}0-9\-_\s]{3,30}[\p{Letter}0-9]$/u;
    static goodNameMessage = 'Great name :3';
    static nameRestrictionsMessage = '5-32 characters (A-z, 0-9, _, -)';
    static propTypes = {cookies: instanceOf(Cookies).isRequired};

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameValidation: {
                isValid: false,
                message: CreateRoomForm.nameRestrictionsMessage
            }
        };
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.state.nameValidation.isValid) {
            return;
        }

        Api.newRoom(this.state.name.trim(), this.props.cookies.get('accessToken')).then(
            () => {this.props.history.goBack();}
        );
    }

    onNameChanged(event) {
        const state = {name: event.target.value.trimLeft()};

        if (state.name.match(CreateRoomForm.nameRegex) === null) {
            state.nameValidation = {isValid: false, message: CreateRoomForm.nameRestrictionsMessage};
        } else {
            state.nameValidation = {isValid: true, message: CreateRoomForm.goodNameMessage};
        }

        this.setState(state);
    }

    render() {
        const isDisabled = this.props.cookies.get('accessToken') === undefined;

        return (
            <Form
                className={'d-flex flex-row'}
                autoComplete={'off'}
                onSubmit={this.onSubmit.bind(this)}
                onClick={
                    () => {
                        if (isDisabled) {
                            // Request register.
                            this.props.history.push('#register');
                        }
                    }
                }
            >
                <Form.Group className={'flex-grow-1'}>
                    <Form.Control
                        className={'me-3'}
                        type={'text'}
                        required={true}
                        placeholder={'Create new room...'}
                        value={this.state.name}
                        onChange={this.onNameChanged.bind(this)}
                        isValid={this.state.nameValidation.isValid}
                        isInvalid={!this.state.nameValidation.isValid}
                    />
                    <Form.Control.Feedback type={this.state.nameValidation.isValid ? 'valid' : 'invalid'}>
                        {this.state.nameValidation.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button className={'mb-auto ms-3'} type={'submit'} variant={'outline-primary'}>
                    Create
                </Button>
            </Form>
        );
    }
}

export default withCookies(CreateRoomForm);
