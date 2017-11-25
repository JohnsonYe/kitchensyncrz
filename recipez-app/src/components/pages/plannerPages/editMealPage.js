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
import {Button, Modal, DropdownButton, MenuItem, ButtonToolbar} from 'react-bootstrap';


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
        <div className="mt-3">
        <p>Select a day</p>
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
        </div>
    );
}

function TimeSelector(props) {
    return(
        <div className="mt-3">
            <p>Select a starting time</p>
            <ButtonToolbar>
                <DropdownButton
                    onSelect={props.handleHour}
                    title={props.hour}
                    noCaret>
                    <MenuItem eventKey="1">1</MenuItem>
                    <MenuItem eventKey="2">2</MenuItem>
                    <MenuItem eventKey="3">3</MenuItem>
                    <MenuItem eventKey="4">4</MenuItem>
                    <MenuItem eventKey="5">5</MenuItem>
                    <MenuItem eventKey="6">6</MenuItem>
                    <MenuItem eventKey="7">7</MenuItem>
                    <MenuItem eventKey="8">8</MenuItem>
                    <MenuItem eventKey="9">9</MenuItem>
                    <MenuItem eventKey="10">10</MenuItem>
                    <MenuItem eventKey="11">11</MenuItem>
                    <MenuItem eventKey="12">12</MenuItem>
                </DropdownButton>
                :
                <DropdownButton
                    onSelect={props.handleMin}
                    title={props.min}
                    noCaret>
                    <MenuItem eventKey="0">00</MenuItem>
                    <MenuItem eventKey="5">05</MenuItem>
                    <MenuItem eventKey="10">10</MenuItem>
                    <MenuItem eventKey="15">15</MenuItem>
                    <MenuItem eventKey="20">20</MenuItem>
                    <MenuItem eventKey="25">25</MenuItem>
                    <MenuItem eventKey="30">30</MenuItem>
                    <MenuItem eventKey="35">35</MenuItem>
                    <MenuItem eventKey="40">40</MenuItem>
                    <MenuItem eventKey="45">45</MenuItem>
                    <MenuItem eventKey="50">50</MenuItem>
                    <MenuItem eventKey="55">55</MenuItem>
                </DropdownButton>
                <DropdownButton
                    onSelect={props.handleNoon}
                    title={props.noon}
                    noCaret>
                    <MenuItem eventKey="am">am</MenuItem>
                    <MenuItem eventKey="pm">pm</MenuItem>
                </DropdownButton>
            </ButtonToolbar>
        </div>
    );

}

class MealEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            days: ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            showEditor: false,
            dayOnBtn: "Day",
            hourOnBtn: "12",
            minOnBtn: "00",
            noonOnBtn: "pm",
            endtime: "calculating ..."
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
                    <TimeSelector
                        handleHour={null}
                        handleMin={null}
                        handleNoon={null}
                        hour={this.state.hourOnBtn}
                        min={this.state.minOnBtn}
                        noon={this.state.noonOnBtn}
                    />

                    <div className="mt-3">
                    <p>Your meal should be ready at {this.state.endtime}.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button onClick={null}>Save</Button>
                        <Button bsStyle="danger" onClick={null}>Delete</Button>
                        <Button onClick={this.close}>Close</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
            </div>
        );
    }
}

export default MealEditor;
