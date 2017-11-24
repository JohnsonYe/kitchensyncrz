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
    Button, Modal, Image, DropdownButton, MenuItem, Form,
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
                            src="http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"
                            alt="No Image"
                        />
                        <figcaption>Description</figcaption>
                    </figure>

                    <div className="inline">
                        <img
                            src="http://clipartwork.com/wp-content/uploads/2017/02/clock-timer-clipart.png"
                            alt="Timer"
                            height={10}
                            width={10}/>
                        <h6>Cooking Duration</h6>
                    </div>

                    <h4>Meal Info</h4>
                    <h6>Day</h6>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            Day
                        </button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#" >Sunday</a>
                            <a className="dropdown-item">Monday</a>
                            <a className="dropdown-item">Tuesday</a>
                            <a className="dropdown-item">Wednesday</a>
                            <a className="dropdown-item">Thursday</a>
                            <a className="dropdown-item">Friday</a>
                            <a className="dropdown-item">Saturday</a>
                        </div>
                    </div>
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
