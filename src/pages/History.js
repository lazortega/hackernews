import React from 'react';
import { useSelector } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";

export  function History(props) {
    const searchHistory = useSelector(state => state.searchs);

    return (
        <>
            {searchHistory.map(item => {
               return <Row key={item.id}>
                    <Col md={12}>
                        <Card >
                            <Card.Header>{item.timeStamp}</Card.Header>
                            <Card.Body>
                                <p>You Searched {item.query}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            })}
        </>
    );
};
