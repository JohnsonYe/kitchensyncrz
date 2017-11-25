/**
 * Title: plannerPageDefault.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 *
 * Description: This file will be in charge of editing or creating new meals
 * Depending on whether the user is planning or removing the meal
 *
 * Time will be based of 24 hour Military System
 */
import React, { Component } from 'react';
import {Button, Modal, DropdownButton, MenuItem} from 'react-bootstrap';


function Duration(props) {
    return (
        <div>
            <div className="d-sm-inline-block">
                <h4>Cooking Duration</h4>
            </div>&nbsp;
            <div className="d-sm-inline-block">
                <img
                    className="image-fluid"
                    src="http://clipartwork.com/wp-content/uploads/2017/02/clock-timer-clipart.png"
                    alt="Timer"
                    width={20}
                    height={20}
                />
            </div>
        </div>
    );

}

function DaySelector(props) {
    return (
        <DropdownButton
            onSelect={props.handleClick}
            title={props.btnTitle}
            id="dropdown-no-caret"
            noCaret>
            <MenuItem eventKey="0">Sunday</MenuItem>
            <MenuItem eventKey="1">Monday</MenuItem>
            <MenuItem eventKey="2">Tuesday</MenuItem>
            <MenuItem eventKey="3">Wednesday</MenuItem>
            <MenuItem eventKey="4">Thursday</MenuItem>
            <MenuItem eventKey="5">Friday</MenuItem>
            <MenuItem eventKey="6">Saturday</MenuItem>
        </DropdownButton>
    );
}

class MealEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            days: ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            showEditor: false,
            dayOnBtn: "Day"
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleDaySelection = this.handleDaySelection.bind(this);
    }

    /** Updates the day the meal will be planned */
    handleDaySelection(evt) {
        this.setState({ dayOnBtn: this.state.days[evt] });
    }


    /**Method that opens Modal*/
    open() {
        this.setState( {showEditor: true} );
    }

    /**Method that closes modal*/
    close() {
        this.setState( {showEditor: false} );
    }


    render() {

        return (
            <div>
                <a
                    className="card-link"
                    onClick={this.open}>Recipe Title
                </a>

            <Modal show={this.state.showEditor} onHide={this.close}>
                <Modal.Header>Recipe Title</Modal.Header>
                <Modal.Body>
                    <figure>
                        <img
                            className="img-fluid"
                            src="http://twolovesstudio.com/wp-content/uploads/sites/5/2017/05/99-Best-Food-Photography-Tips-5-1.jpg"
                            alt="No Image"
                        />
                        <figcaption>His palms are sweaty, knees weak, arms are heavy
                            There's vomit on his sweater already, mom's spaghetti
                            He's nervous, but on the surface he looks calm and ready
                            To drop bombs, but he keeps on forgettin'
                            What he wrote down, the whole crowd goes so loud
                            He opens his mouth, but the words won't come out
                            He's chokin', how, everybody's jokin' now</figcaption>
                    </figure>

                    <Duration/>
                    <div className="border
                                    border-dark
                                    border-top-0
                                    border-right-0
                                    border-left-0
                                    mb-2">
                        <h2>Meal Info</h2>
                    </div>
                    <DaySelector
                        handleClick={this.handleDaySelection}
                        btnTitle={this.state.dayOnBtn}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
            </div>
        );
    }
}

export default MealEditor;
