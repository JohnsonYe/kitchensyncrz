/**
 * Title: plannerPageDefault.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 *
 * Description: This file will be the first page the user sees when
 * selecting Planner from the navbar. All other planner related pages
 * are can be accessed from this one. At the bottom of this page is a link
 * to a full week planner.
 *
 * Components: dailyMealPlanner, shoppingList
 */
import React, { Component } from 'react';
import { Grid , Row, Col, Table } from 'react-bootstrap';

class Planner extends Component {

    constructor(props) {
        super(props);
        var now = new Date(),
            days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            today = days[now.getDay()] + " " + now.getDate().toString() + ", " + (1900+now.getYear()).toString(),
            mealTable = (
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Today's Meals</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>[Time Block]</td>
                        <td>Meal 1</td>
                    </tr>
                    <tr>
                        <td>[Time Block]</td>
                        <td>Meal 2</td>
                    </tr>
                    <tr>
                        <td>[Time Block</td>
                        <td>Meal 3</td>
                    </tr>
                    </tbody>
                </Table>
            );


        this.state = {
            date: today,
            numMeals: 0,
            numShopItems: 0,
            numMealsPrepared: 0,
            mealTable: mealTable
        };
    }

    render() {
        return (

            <div>
                <div className="jumbotron">
                    <h1>Planner</h1>
                </div>

            <Grid fluid={true} className='container-fluid'>
                <Row className='content'>
                    <Col xs={6} md={4}>
                        <h3>Daily Meal Planner</h3>
                        <h5>{this.state.date}</h5>
                    </Col>
                    <Col xs={1}></Col>
                    <Col xs={2} md={1} >
                        <h1>{this.state.numMeals}</h1>
                        <h4>Meals</h4>
                    </Col>
                    <Col xs={1}></Col>
                    <Col xs={2} md={1} >
                        <h1>{this.state.numMealsPrepared}</h1>
                        <h4>Prepared</h4>
                    </Col>


                    <Col xs={8} md={4}>
                        <h3>Shopping List</h3>
                    </Col>
                    <Col xs={2} md={2} >
                        <h1>{this.state.numShopItems}</h1>
                        <h4>Items</h4>
                    </Col>
                </Row>

                <Row>
                    <Col className="meal-list-container" xs={12} md={6}>
                        {this.state.mealTable}
                    </Col>
                    <Col className="shopping-list" xs={12} md={6}>
                    </Col>
                </Row>

                <Row className="button-section">
                    <button>View Full Week Planner</button>
                </Row>
            </Grid>
            </div>

        );
    }
}

export default Planner;