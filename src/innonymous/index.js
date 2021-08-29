import 'innonymous/assets/css/index.css';

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navigation from 'innonymous/components/navigation';
import Rooms from 'innonymous/components/rooms';
import Chat from 'innonymous/components/chat';


class Innonymous extends React.Component {
    constructor() {
        super(null);

        this.state = {
            width: window.innerWidth,
        };
    }

    componentWillMount() {
        window.addEventListener(
            'resize',
            this.handleWindowSizeChange
        );
    }

    componentWillUnmount() {
        window.removeEventListener(
            'resize',
            this.handleWindowSizeChange
        );
    }

    handleWindowSizeChange = () => {
      this.setState(
          { width: window.innerWidth }
      );
    };

    render() {
        const { width } = this.state;
        const isMobile = width <= 800;

        if (isMobile) {
            return (
                <div>
                    <Navigation/>
                    <Rooms fluid/>
                </div>
            );
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col className='rooms col-3 border-end'>
                            <Navigation/>
                            <Rooms/>
                        </Col>
                        <Chat className='col' fluid/>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Innonymous;
