/**
 * Title: plannerItem.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This component is an item inside planner
 */
import React, { Component } from 'react';
import Panel from "react-bootstrap/es/Panel";
import ListGroup from "react-bootstrap/es/ListGroup";
import ListGroupItem from "react-bootstrap/es/ListGroupItem";

class PlannerItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const title = (
            <h5>{this.props.day}</h5>
        );

        const weekDay = (
            <div className="day">
                <Panel bsStyle="default" header={title}>
                    <ListGroup>
                        <ListGroupItem href="#">Breakfast: {this.props.meal}</ListGroupItem>
                        <ListGroupItem href="#">Lunch: {this.props.meal}</ListGroupItem>
                        <ListGroupItem href="#">Dinner: {this.props.meal}</ListGroupItem>
                    </ListGroup>
                </Panel>
            </div>
        )

        return (
            weekDay
        );

    }
}

export default PlannerItem;