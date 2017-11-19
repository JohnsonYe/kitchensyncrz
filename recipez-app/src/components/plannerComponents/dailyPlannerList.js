/**
 * Title: dailyPlannerList.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 *
 * Description: This file will be the component that is a list of meals for the day
 *
 */
import React, { Component } from 'react';
import {
    Button,
    Grid,
    Row,
    Col,
    Image} from 'react-bootstrap';

import MealEditor from "../pages/plannerPages/editMealPage";

function DailyPlannerItem(props) {

    const spaghetti = "https://cdn5.norecipes.com/wp-content/uploads/2012/10/23052346/recipespaghetti-meat-sauce-recipe.1024x1024-1.jpg"
    const moms = "Moms Spaghetti theres vomit on his sweater already"
    const noImg = "http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"
    return (
        <Grid className="meal-item">
            <Row className="meal-item-row">
                <Col xs={1} md={2}>
                    <h4>[Time Block]</h4>
                </Col>
                <Col xs={5} md={3}>
                <Image src={noImg}
                       responsive
                       thumbnail
                    />
                </Col>
                <Col xs={4} md={6}>
                    <h4>
                        Recipe title
                    </h4>
                    <p>Description......</p>
                </Col>
                <Col xs={2} md={1}>
                    <Grid>
                        <Row>
                            <Button bsSize="xsmall" bsStyle="primary">Get Started</Button>
                        </Row>
                        <Row>
                            <Button bsSize="xsmall" bsStyle="danger">Remove</Button>
                        </Row>
                        <Row>
                            <MealEditor />
                        </Row>
                    </Grid>
                </Col>
            </Row>
        </Grid>
    );
}

class DailyPlanner extends Component {

    constructor(props) {
        super(props);
        var meals = [];
        this.state = {
            meals: meals
        };
    }

    /**
     * Adds a meal to the list
     */
    addMeal() {
        this.setState()
    }


    render() {
        return (
            <div>
                <DailyPlannerItem />&nbsp;
                <DailyPlannerItem />&nbsp;
                <DailyPlannerItem />
            </div>
        );
    }
}


export default DailyPlanner;