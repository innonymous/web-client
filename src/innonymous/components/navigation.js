import 'innonymous/assets/css/navigation.css';

import React from 'react';

import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Search from 'react-bootstrap-icons/dist/icons/search';


class Navigation extends React.Component {
    render() {
        return (
            <Navbar expand='false' className='border-bottom' {...this.props}>
                <Navbar.Brand>Innonymous</Navbar.Brand>
                <Navbar.Toggle aria-controls='search-form-collapse'>
                    <Search/>
                </Navbar.Toggle>
                <Navbar.Collapse id='search-form-collapse'>
                    <Form className='search-form'>
                        <Form.Control
                            type='search'
                            placeholder='Search'
                            className='mr-2'
                            aria-label='Search'
                        />
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
