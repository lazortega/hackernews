import React from 'react';
import { useHistory } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HistoryIcon from '@material-ui/icons/History';
import SearchIcon from '@material-ui/icons/Search';

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
                    <Navbar.Brand href="/search">Hacker News <AnnouncementIcon/></Navbar.Brand>
                    <Nav className="mr-auto" defaultActiveKey="/" onSelect={handleSelect}>
                        <Nav.Link eventKey="search" active={isActive(history, '/search')} href="/search" ><SearchIcon/> Search</Nav.Link>
                        <Nav.Link eventKey="history" active={isActive(history, '/history')} href="/history" ><HistoryIcon/> Search History</Nav.Link>
                    </Nav>
                </Navbar>
            </header>
        </>
    );
};
