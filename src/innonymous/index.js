import 'innonymous/assets/css/index.css';

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navigation from 'innonymous/components/navigation';
import Rooms from 'innonymous/components/rooms';
import Chat from 'innonymous/components/chat';
import Messages from 'innonymous/components/rooms';

const uuid = '86e3e0c7-5396-4edb-887d-89249ca02bb3';


class Innonymous extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth,
            messages: [],
        };
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

    componentDidMount() {
        window.addEventListener(
            'resize',
            this.handleWindowSizeChange
        );
        fetch(`https://innonymous.tk/api/rooms/${uuid}/messages`)
            .then(response => response.json())
            .then(data => this.setState({messages: data.messages}))
            .then(console.log('abs'))
    }

    render() {
        const { width } = this.state;
        const isMobile = width <= 800;
        const {messages} = this.state;

        if (isMobile) {
            return (
                <div>
                    <Navigation/>
                    <Rooms fluid/>

                </div>
            );
        }

        return (
            <main className = 'container content'>
                {
                    messages.length ? (
                        <Messages messages = {this.state.messages}/>
                    ) : <h4>Loading...</h4>
                }
                <Container fluid>
                    <Row>
                        <Col className='rooms col-3 border-end'>
                            <Navigation/>
                            <Rooms/>
                        </Col>
                        <Chat className='col' fluid/>
                    </Row>
                </Container>
            </main>

        );
    }
}

export default Innonymous;
