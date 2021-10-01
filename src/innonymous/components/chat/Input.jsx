import React from 'react';

import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import 'innonymous/assets/css/chat/input.css';
import Api from 'innonymous/Api';


class Input extends React.Component {
    static propTypes = {cookies: instanceOf(Cookies).isRequired};

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {message: ''};
    }

    onSubmit(event) {
        // Do not lose focus on press send.
        this.inputRef.current.focus();

        // Prevent page reload.
        event.preventDefault();

        // Clear message.
        const message = this.state.message.trim();

        // Empty message.
        if (message.length === 0) {
            return;
        }

        // Send message.
        Api.newMessage(this.props.roomUuid, message, this.props.cookies.get('accessToken')).then(
            () => {
                // Clear message.
                this.setState({message: ''})
            }
        );
    }

    render() {
        const isDisabled = this.props.cookies.get('accessToken') === undefined;

        return (
            <Form
                className={'d-flex flex-row'}
                onClick={
                    () => {
                        if (isDisabled) {
                            // Request register.
                            this.props.history.push('#register');
                        }
                    }
                }
                onSubmit={this.onSubmit.bind(this)}
            >
                <Form.Group className={'flex-grow-1 m-3'} controlId={'message'}>
                    <Form.Control
                        ref={this.inputRef}
                        as={'textarea'}
                        className={'message'}
                        placeholder={'Type your message here...'}
                        required={true}
                        disabled={isDisabled}
                        value={this.state.message}
                        onChange={(event)=> {this.setState({message: event.target.value.trimLeft()})}}
                        onKeyDown={
                            (event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    this.onSubmit(event);
                                }
                            }
                        }
                    />
                </Form.Group>
                <Button
                    className={'mt-auto mb-3 me-3'}
                    variant={'outline-primary'}
                    type={'submit'}
                    disabled={isDisabled}
                >
                    Send
                </Button>
            </Form>
        );
    }
}

export default withCookies(Input);
