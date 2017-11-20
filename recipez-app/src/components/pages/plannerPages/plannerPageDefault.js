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
    Jumbotron,
    Image} from 'react-bootstrap';

import MealEditor from "./editMealPage";

function DailyPlannerItem(props) {

    const noImg = "http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"

    return (
        <Grid className="meal-item" fluid>
        <Row>
            <Col md={1}>
                <h4>[Time Block]</h4>
            </Col>
            <Col md={3}>
                <Image src={noImg} thumbnail responsive/>
            </Col>
            <Col md={6}>
                <h4>
                    {props.meal}
                </h4>
                <p>Description......</p>
            </Col>
            <Col smPull={2} md={2}>
                <Button bsSize="xsmall" bsStyle="primary">Get Started</Button>
                <Button bsSize="xsmall" bsStyle="danger">Remove</Button>
                <MealEditor />
            </Col>
        </Row>
        </Grid>
    );
}

function MealList(props) {
    return (
        <div className="container">
            {
                Object.keys(props.meals).map( (key) => {
                    return <DailyPlannerItem meal={props.meals[key]} />
                })
            }
        </div>
    );
}

class AddToPlannerButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mealNum: 0
        }
        this.createMeal = this.createMeal.bind(this);
    }

    createMeal() {
        var meal = "Meal " + this.state.mealNum;
        this.setState({ mealNum: (++this.state.mealNum) })
        this.props.addMeal(meal);
    }

    render() {
        return(
            <button
                onClick={this.createMeal}>
                Save
            </button>
        );
    }
}


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
            mealData: mealData,
            meals: {}
        };

        this.addMeal = this.addMeal.bind(this);
    }

    /**
     * Adds a meal to the list
     */
    addMeal(meal) {
        var timestamp = (new Date().getTime());
        this.state.meals['meal-'+timestamp] = meal;
        this.setState({ meals : this.state.meals });
    }


    render() {

        return (
            <div>
                <Jumbotron>
                    <h1>Planner</h1>
                </Jumbotron>

            <Grid>
                <Row className='planner-header'>
                    <Col xs={12} md={6}>
                        <h3>Daily Meal Planner</h3>
                        <h5>{this.state.date}</h5>

                        <div className="counter">
                            <h1>{this.state.numMeals}</h1>
                            <h4>Meals</h4>
                        </div>

                        <div className="counter">
                            <h1>{this.state.numMealsPrepared}</h1>
                            <h4>Prepared</h4>
                        </div>

                        <MealList meals={this.state.meals}/>
                        <AddToPlannerButton addMeal={this.addMeal} />

                    </Col>
                </Row>
                &nbsp;
                <Row>
                    <Col xs={12} md={6}>
                        <h3>Shopping List</h3>
                        <div className="counter">
                            <h1>{this.state.numShopItems}</h1>
                            <h4>Items</h4>
                        </div>
                    </Col>
                </Row>&nbsp;
                <Row>
                    <Button bsStyle="info" block>View Full Week Planner</Button>
                </Row>
            </Grid>
            </div>

        );
    }
}

export default Planner;