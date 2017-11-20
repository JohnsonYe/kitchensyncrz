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
import {
    Button, Grid, Row, Col, Modal, Image, ButtonGroup, DropdownButton, MenuItem, Form,
    FormControl, FormGroup, ControlLabel
} from 'react-bootstrap';

class MealEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEditor: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState( {showEditor: true} );
    }

    close() {
        this.setState( {showEditor: false} );
    }

    render() {


        return (
            <div>
            <Button
                onClick={this.open}
                bsStyle="info"
                bsSize="xsmall">Edit Meal
            </Button>

            <Modal show={this.state.showEditor} onHide={this.close}>
                <Modal.Header>Recipe Title</Modal.Header>

                <Modal.Body>
                    <figure>
                        <Image src="http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"
                            responsive/>
                        <figcaption>Description</figcaption>
                    </figure>

                    <p>
                        <img
                            src="http://clipartwork.com/wp-content/uploads/2017/02/clock-timer-clipart.png"
                            alt="Timer"
                            height={10}
                            width={10}/>&nbsp;
                        <h6>Cooking Duration</h6>
                    </p>

                    <h4>Meal Info</h4>
                    <h6>Day</h6>
                    <DropdownButton
                        title="Day"
                        bsStyle="info"
                        bsSize="small">
                        <MenuItem >Sunday</MenuItem>
                        <MenuItem >Monday</MenuItem>
                        <MenuItem >Tuesday</MenuItem>
                        <MenuItem >Wednesday</MenuItem>
                        <MenuItem >Thursday</MenuItem>
                        <MenuItem >Friday</MenuItem>
                        <MenuItem >Saturday</MenuItem>
                    </DropdownButton>
                    <h6>Start Time</h6>
                    <Form inline>
                        <FormGroup controlId="formInLineHour">
                            <ControlLabel>Hour</ControlLabel>
                            {' '}
                            <FormControl type="text" placeholder="12"/>
                        </FormGroup>

                        <FormGroup controlId="formInLineMin">
                            <ControlLabel>Hour</ControlLabel>
                            {' '}
                            <FormControl type="text" placeholder=":30"/>
                        </FormGroup>
                        <DropdownButton
                            title="am/pm"
                            bsStyle="info"
                            bsSize="small">
                            <MenuItem >am</MenuItem>
                            <MenuItem >pm</MenuItem>
                        </DropdownButton>
                    </Form>
                    <h6>End Time</h6>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        bsStyle="primary"
                    >Add to Planner</Button>
                    <Button
                        bsStyle="danger"
                    >Remove</Button>
                    <Button
                        onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
            </div>
        );
    }
}

export default MealEditor;