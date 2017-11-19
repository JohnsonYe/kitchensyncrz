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
import {
    Grid ,
    Row,
    Col,
    Button,
    Jumbotron} from 'react-bootstrap';
import DailyPlanner from "../../plannerComponents/dailyPlannerList";

class Planner extends Component {

    constructor(props) {
        super(props);
        var
            now = new Date(),
            //Days of the Week String References
            days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            today = days[now.getDay()] + " " + now.getDate().toString() + ", " + (1900+now.getYear()).toString(),
            mealData = []; /*TODO Change to getMealData after testing*/

        this.state = {
            day: now.getDate(),
            date: today,
            numMeals: 0,
            numShopItems: 0,
            numMealsPrepared: 0,
            mealData: mealData
        };
    }


    render() {

        return (
            <div>
                <Jumbotron>
                    <h1>Planner</h1>
                    <p>
                        Meal Planner is a feature that allows the you
                        to schedule
                        meals from your Cookbook,
                        for every day of the week.
                    </p>
                </Jumbotron>

            <Grid>
                <Row className='content'>
                    <Col xs={8} md={8}>
                        <h3>Daily Meal Planner</h3>
                        <h5>{this.state.date}</h5>
                    </Col>
                    <Col xs={2} md={2} >
                        <h1>{this.state.numMeals}</h1>
                        <h4>Meals</h4>
                    </Col>
                    <Col xs={2} md={2} >
                        <h1>{this.state.numMealsPrepared}</h1>
                        <h4>Prepared</h4>
                    </Col>

                </Row>
                &nbsp;
                <Row>
                    <Col className="meal-list-container" xs={12} md={6}>
                        <DailyPlanner />
                    </Col>
                </Row>
                &nbsp;

                <Row>
                    <Col xs={8} md={8}>
                        <h3>Shopping List</h3>
                    </Col>
                    <Col xs={4} md={4} >
                        <h1>{this.state.numShopItems}</h1>
                        <h4>Items</h4>
                    </Col>
                </Row>
                &nbsp;

                <Row>
                    <Col className="shopping-list" xs={12} md={6}>
                    </Col>
                </Row>
                &nbsp;

                <Row className="button-section">
                    <Button bsStyle="info" block>View Full Week Planner</Button>
                </Row>
            </Grid>
            </div>

        );
    }
}

export default Planner;