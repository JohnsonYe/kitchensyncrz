/**
 * Title: newPersonalRecipe.js
 * Author: Matthew Taylor, Melvin Wijaya
 * Date Created: 11/19/2017
 *
 * Description: This file handles creating new recipe
 */

import React, { Component } from 'react';
import { FormGroup, FormControl, Form, ControlLabel } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

class NewRecipe extends Component {

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
                <button type="button" className="btn btn-primary" onClick={this.open}>Create New Recipe</button>

                <Modal show={this.state.showEditor} onHide={this.close}>

                    {/*Modal Header*/}
                    <Modal.Header>
                        <h3>New Recipe</h3>
                    </Modal.Header>

                    {/*Modal Body*/}
                    <Modal.Body>
                        <Form>
                            <FormGroup controlId="formControlsText">
                                <ControlLabel>Title</ControlLabel>
                                <FormControl type="text" placeholder="Enter recipe title" />
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    {/*Modal Footer*/}
                    <Modal.Footer>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-4">
                                <button type="button" className="btn btn-primary">Create</button>
                            </div>
                            <div className="col-md-4">
                                <button type="button" className="btn btn-danger" onClick={this.close}>Close</button>
                            </div>
                        </div>
                    </Modal.Footer>

                </Modal>
            </div>
        );
    }
}

export default NewRecipe;