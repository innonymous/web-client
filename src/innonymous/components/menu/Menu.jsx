import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import CreateRoomForm from 'innonymous/components/menu/CreateRoomForm';


class Menu extends React.Component {
    render() {
        return (
            <Navbar className={this.props.className} expand={false} sticky={'top'}>
                <Container fluid={true}>
                    <Navbar.Brand>Innonymous</Navbar.Brand>
                    <Navbar.Toggle onClick={() => this.props.history.push('#menu')}/>
                    <Offcanvas show={this.props.show} aria-labelledby={'menu-label'} placement={'start'}>
                    <Offcanvas.Header closeButton onHide={() => this.props.history.goBack()}>
                        <Offcanvas.Title id={'menu-label'}>Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <CreateRoomForm history={this.props.history}/>
                    </Offcanvas.Body>
                </Offcanvas>
                </Container>
            </Navbar>
        );
    }
}

export default Menu;
