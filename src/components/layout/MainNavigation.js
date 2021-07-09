import React from 'react';
import { useHistory } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HomeIcon from '@material-ui/icons/Home';

function isActive(history, path){
    const { pathname } = history.location;
    return (pathname === path ? true : false);
}

export default function MainNavigation(props) {
    const history = useHistory();

    function handleSelect(eventKey) {
        console.log(eventKey);
        return;
    }

    return (
        <>
            <header >
                <Navbar bg="light" variant="light" expand="md">
                    <Navbar.Brand href="/home">Hacker News <AnnouncementIcon/></Navbar.Brand>
                    <Nav className="mr-auto" defaultActiveKey="/" onSelect={handleSelect}>
                        <Nav.Link eventKey="home" active={isActive(history, '/home')} href="/home" ><HomeIcon/></Nav.Link>
                    </Nav>
                </Navbar>
            </header>
        </>
    );
};
