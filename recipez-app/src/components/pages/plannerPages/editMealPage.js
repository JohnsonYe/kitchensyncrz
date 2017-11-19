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
import { Button, Grid, Row, Col } from 'react-bootstrap';

var Modal = require('react-bootstrap-modal');

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

        const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
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
                    <Grid>
                        <Row>
                            <Col xs={12} md={6} >
                            <img src="http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"
                                alt="No Image Available"
                                height={200}
                                width={200}/>
                            </Col>
                            <Col xs={12} md={6} >
                                <p>Description</p>
                            </Col>
                        </Row>
                        <Row>
                            <img src="http://clipartwork.com/wp-content/uploads/2017/02/clock-timer-clipart.png"
                                alt="Timer"
                                height={10}
                                width={10}/>&nbsp;
                                <h6>Cooking Duration</h6>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                        <Button bsStyle="primary"
                                >Save</Button>
                        <Button bsStyle="danger"
                                >Remove</Button>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
            </div>
        );
    }
}

export default MealEditor;