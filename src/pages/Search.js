import React, {useState, useEffect} from 'react';
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {getNews, mapTime, toTimestamp} from '../lib/Api';
import { ProcessModal } from '../components/ProcessModal';

const columns = [
    {
        dataField: "id",
        text: "ID",
        sort: true,
        hidden: true,
    },
    {
        dataField: "author",
        text: "Author",
        sort: true,
    },
    {
        dataField: "title",
        text: "Title",
    },
    {
        dataField: "url",
        text: "Url",
        formatter: (cell, row) => <a target='_blank' href={cell}> {cell} </a>
    },
    {
        dataField: "posted",
        text: "Posted",
    },
];

const commentColumns = [
    {
        dataField: "id",
        text: "ID",
        sort: true,
        hidden: true,
    },
    {
        dataField: "author",
        text: "Author",
        sort: true,
    },
    {
        dataField: "title",
        text: "Title",
    },
    {
        dataField: "url",
        text: "Comments",
    },
    {
        dataField: "posted",
        text: "Posted",
    },
];

const searchRef = React.createRef();

export function Search(props) {
    const [algoliaFilter, setAlgoliaFilter] = useState('story');
    const [algoliaFilterFor, setAlgoliaFilterFor] = useState('all');
    const [processDisabled,setProcessDisabled] = useState(false);
    const [displayModal,setDisplayModal] = useState(false);
    const [newsHits, setNewsHits] = useState([]);
    const [transformedData, setTransformedData] = useState([]);

    const [error, setError] = useState(null);

    // Load Front Page News for ALl Time on Initial Render
    useEffect(() => {
        const localtransformedData = [];

        async function getFrontPage() {
            const axiosFetchResponse = await getNews('',
                'front_page',
                'all').then(data => {return data;});
            return axiosFetchResponse;
        }

        try {

            const axiosFetchResponse = getFrontPage();

            axiosFetchResponse.then(function (data) {
                data.data.hits.map((obj,index) => (
                    localtransformedData.push({
                        id: index,
                        author: obj.author,
                        title: obj.title,
                        url: obj.url,
                        created_at: obj.created_at,
                        created_at_i: obj.created_at_i,
                        posted: mapTime(obj.created_at_i) + ' ago'
                    })
                ));
                setTransformedData(localtransformedData); // I know, I know Infinite Loop
            });

        } catch (error) {
            setError(error.message);
        }

    },[]); // [] To Avoid the Infinite Loop

    // #TODO: Temp fx used to simulate RPC calls
    // function stall used to simulate an async process with a 6 sec delay by default
    async function stall(stallTime = 6000) {
        await new Promise(resolve => setTimeout(resolve, stallTime));
    }

    function handleOnConfirm(){
        // Called from ProcessModal component
        setDisplayModal(false);
        setProcessDisabled(false);
    }

    function handleFilter(event) {
        //console.log("Filter => ", event.target.value);
        setAlgoliaFilter(event.target.value);
        fetchAlgolia();
    }

    function handleFilterFor(event) {
        //console.log("FilterFor => ", event.target.value);
        setAlgoliaFilterFor(event.target.value);
        fetchAlgolia();
    }

    async function fetchAlgolia() {
        const localtransformedData = [];

        setDisplayModal(true);

        try {

            const axiosFetchResponse = await getNews(`${searchRef.current.value}`,
                `${algoliaFilter}`,
                `${algoliaFilterFor}`);

            if (axiosFetchResponse.status !== 200) {
                throw new Error('Something went wrong!');
            }

            //#TODO : Implement more elegant paging based on axiosFetchResponse.data.nbPages
            // const numOfPages = axiosFetchResponse.data.nbPages;
            // console.log('Number of Pages => ',numOfPages);

            const axiosparsedData = await axiosFetchResponse.data;

            axiosparsedData.hits.map(obj => (
                newsHits.push(obj)
            ));

            // #TODO: Debug Code -- Remove
            // console.log('newsHits => ',newsHits);

            newsHits.map((obj,index) => (
                localtransformedData.push({
                    id: index,
                    author: obj.author,
                    title: (obj.title ? obj.title : obj.story_title),
                    url: (algoliaFilter === 'comment' ? obj.comment_text : obj.url),
                    created_at: obj.created_at,
                    created_at_i: obj.created_at_i,
                    posted: mapTime(obj.created_at_i) + ' ago'
                })
            ));

            // #TODO: Debug Code -- Remove
            //console.log('localtransformedData => ',localtransformedData);

            // #TODO: Last 24h Debug Code -- Remove
            // const currDate = new Date();
            // currDate.setHours(currDate.getHours() - 24);
            // console.log('Current Date less 24h',Math.round(currDate.getTime()/1000));
            // console.log('Less 24h',mapTime(Math.round(currDate.getTime()/1000)));

            setNewsHits([]);
            setTransformedData(localtransformedData);
            setDisplayModal(false);

        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <Row>
                <Col md={10}>
                    <Card>
                        <Card.Header>Search Criteria:</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group as={Row} controlId="formHorizontalSearch">
                                    <Form.Label column sm={3}>
                                        Search Hacker News:
                                    </Form.Label>
                                    <Col sm={6}>
                                        <Form.Control ref={searchRef} type="text" placeholder="" />
                                    </Col>
                                    <Col sm={2}>
                                        <Button variant="primary" type="button" disabled={processDisabled} onClick={fetchAlgolia}>
                                            Search
                                        </Button>
                                    </Col>
                                </Form.Group>
                                <Col sm={12}><p></p></Col>
                                <Form.Group as={Row}  controlId="formHorizontalOptions">
                                    <Col sm={1} column>
                                        <Form.Label>Search</Form.Label>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Control as="select" value={algoliaFilter} onChange={handleFilter}>
                                            <option value="story" >Stories</option>
                                            <option value="front_page">Front Page</option>
                                            <option value="comment">Comments</option>
                                        </Form.Control>
                                    </Col>
                                    <Col sm={1} column>
                                        <Form.Label>for</Form.Label>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Control as="select" value={algoliaFilterFor} onChange={handleFilterFor}>
                                            <option value="all" selected>All Time</option>
                                            <option value="past24">Last 24h</option>
                                            <option value="pastWeek">Past Week</option>
                                            <option value="pastMonth">Past Month</option>
                                            <option value="pastYear">Past Year</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                    {error && <p>${error.message}</p>}
                    {displayModal && (<ProcessModal disableButton="true" title="Processing..." message="" onConfirm={handleOnConfirm}/>)}
                </Col>
                <Col md={2}><p></p></Col>
            </Row>
            <Row><Col md={12}><p></p></Col></Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header>Search Results:</Card.Header>
                        <Card.Body>
                            <BootstrapTable
                                bootstrap4
                                keyField="id"
                                data={transformedData}
                                columns={algoliaFilter === 'comment' ? commentColumns : columns}
                                pagination={paginationFactory({ sizePerPage: 50 })}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
