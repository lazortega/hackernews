import React from 'react';
import ReactDom from 'react-dom';
import { Card, Button } from "react-bootstrap";
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

import styles from './ProcessModal.module.css';

function Backdrop(props) {
    return <div className={styles.backdrop} onClick={props.onConfirm}></div>;
}

function ModalOverlay(props) {
    return (
        <Card className={styles.modal}>
            <Card.Header >
                <h2>{props.title} {props.message}</h2>
            </Card.Header>
            <Card.Body>
               <LoadingSpinner/>
            </Card.Body>
            {!props.disableButton && (<Card.Footer><Button onClick={props.onConfirm}>Ok</Button></Card.Footer>)}
        </Card>
    );
};

export function ProcessModal(props) {
    return (
        <React.Fragment>
            {ReactDom.createPortal(
                <Backdrop onConfirm={props.onConfirm} />,
                document.getElementById("backdrop-root")
            )}
            {ReactDom.createPortal(
                <ModalOverlay
                    title={props.title}
                    message={props.message}
                    onConfirm={props.onConfirm}
                    disableButton={props.disableButton}
                />,
                document.getElementById("overlay-root")
            )}
        </React.Fragment>
    );
};
