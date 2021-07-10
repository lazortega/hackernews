import React, {useContext} from 'react';
import MainNavigation from "./MainNavigation";
import {Col, Container, Row} from "react-bootstrap";
import AppContext from "../../store/app-context";
export default function Layout(props) {
    const ctx = useContext(AppContext);
    return (
        <>
            <Container fluid>
                <MainNavigation/>
                <Row><Col md={12}><p></p></Col></Row>
                <main>
                    {props.children}
                </main>
            </Container>
        </>
    );
};
