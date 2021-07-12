import React from 'react';
import MainNavigation from "./MainNavigation";
import {Col, Container, Row} from "react-bootstrap";
export default function Layout(props) {
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
