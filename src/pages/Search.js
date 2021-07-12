import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {getNews, mapTime} from '../lib/Api';
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
        formatter: (cell, row) => <a target='_blank' rel='noreferrer' href={cell}> {cell} </a>
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
const filterRef = React.createRef();
const filterForRef = React.createRef();

export function Search(props) {
    const dispatch = useDispatch();

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

    function handleOnConfirm(){
        // Called from ProcessModal component
        setDisplayModal(false);
        setProcessDisabled(false);
    }

    function handleFilter(event) {
        setAlgoliaFilter(event.target.value);
        fetchAlgolia();
    }

    function handleFilterFor(event) {
        setAlgoliaFilterFor(event.target.value);
        fetchAlgolia();
    }

    function buildHistory(queryArg, filterArg, filterForArg){
        let filterStr = '';
        let filterForStr = '';

        switch (filterArg) {
            case 'story':
                filterStr = 'Stories';
                break;
            case 'front_page':
                filterStr = 'Front Page';
                break;
            case 'comment':
                filterStr = 'Comments'  ;
                break;
            default: break;
        }
        switch (filterForArg) {
            case 'all':
                filterForStr = 'All Time';
                break;
            case 'past24':
                filterForStr = 'Last 24h';
                break;
            case 'pastWeek':
                filterForStr = 'Past Week';
                break;
            case 'pastMonth':
                filterForStr = 'Past Month';
                break;
            case 'pastYear':
                filterForStr = 'Past Year';
                break;
            default: break;
        }

        return queryArg + ' for ' + filterForStr + ' in ' + filterStr;
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

            //TODO: Save the Search History
            const nowDateStr = (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString();
            const key = new Date().getTime();
            dispatch({type: 'push',
                payload: {id: key, timeStamp: nowDateStr, query: buildHistory(searchRef.current.value,algoliaFilter, algoliaFilterFor)}});

            //TODO : Implement more elegant paging based on axiosFetchResponse.data.nbPages
            // const numOfPages = axiosFetchResponse.data.nbPages;
            // console.log('Number of Pages => ',numOfPages);

            const axiosparsedData = await axiosFetchResponse.data;

            axiosparsedData.hits.map(obj => (
                newsHits.push(obj)
            ));

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
                                        <Form.Control as="select" ref={filterRef} value={algoliaFilter} onChange={handleFilter}>
                                            <option value="story" >Stories</option>
                                            <option value="front_page">Front Page</option>
                                            <option value="comment">Comments</option>
                                        </Form.Control>
                                    </Col>
                                    <Col sm={1} column>
                                        <Form.Label>for</Form.Label>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Control as="select"  ref={filterForRef} value={algoliaFilterFor} onChange={handleFilterFor}>
                                            <option value="all" >All Time</option>
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
