/**
 * Title: myPlanner.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will serve as the planner page
 */
import React, { Component } from 'react';
import Planner from '../plannerComponents/planner.js';
import Grid from "react-bootstrap/es/Grid";
import Row from "react-bootstrap/es/Row";
import Col from "react-bootstrap/es/Col";

import User from '../classes/User'

class PlannerPage extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={6}>
                        <h1>Planner</h1>
                        <Planner />
                    </Col>
                    <Col xs={6} md={4}>
                        <h1>Shopping List</h1>
                    </Col>
                </Row>
            </Grid>

        );
    }
}

export default PlannerPage;
