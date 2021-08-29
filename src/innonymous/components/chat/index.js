import React from 'react';

import Container from 'react-bootstrap/Container';

class Chat extends React.Component {
    render() {
        return (
            <Container {...this.props} className={'chat ' + this.props.className}>

            </Container>
        );
    }
}

export default Chat;
