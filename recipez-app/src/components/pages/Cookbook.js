import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import SavedRecipes from "../cookbookComponents/savedRecipes";
import PersonalRecipes from "../cookbookComponents/personalRecipes";
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';
import { Button, Grid, Row, Col, FormGroup, FormControl, Form, ControlLabel } from 'react-bootstrap';
import '../../css/Cookbook.css';


class Cookbook extends Component {

    constructor(props){
        super(props);

        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(){



    }

    componentWillMount() {
        this.setState({
            isMenuOpened: false
        })
    }

    handleClick(){
        this.setState({ isMenuOpened: !this.state.isMenuOpened});
    }



    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Cookbook</h1>
                </div>
                <div className="container">

                    {/* Cookbook Summary statistics content here */}
                    <div className="row">

                        <h4>Cookbook Summary</h4>


                    </div>
                    <div className="row">
                        <div className="col-md-9">

                            {/* Nav bar content here */}
                            <div className="row">
                                <Tabs defaultActiveKey={1}>
                                    <Tab eventKey={1} title={"Saved Recipes"}>
                                        Saved Recipes here
                                        <SavedRecipes/>
                                    </Tab>
                                    <Tab eventKey={2} title={"Personal Recipes"}>
                                        Personal Recipes here
                                        <PersonalRecipes/>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>

                        {/* TODO: Swing-out personal recipe edit/create area */}
                        <div className="col-md-3">
                            <OffCanvas className="newRecipe" width='600' transitionDuration='300' isMenuOpened={this.state.isMenuOpened} position="right">
                                <OffCanvasBody className="navbar-icon">
                                    <a href="#" className="btn btn-primary" role="button" onClick={this.handleClick.bind(this)}>
                                        New recipe
                                    </a>
                                </OffCanvasBody>
                                <OffCanvasMenu className="newRecipeMenu">
                                    {/*Form for the recipe title*/}
                                        <Form horizontal>
                                            <FormGroup controlId="formHorizontalTitle">
                                                Title
                                                <FormControl type="title" placeholder="Recipe title" />
                                            </FormGroup>
                                        </Form>

                                    <div className="row">
                                        <img src="http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"
                                             alt="No Image Available"
                                            height={150}
                                            width={150} />
                                    </div>

                                    <div className="row">
                                        <Button bsStyle="info"
                                             bsSize="xsmall">
                                            Upload Image
                                        </Button>
                                    </div>


                                    {/*Form for the ingredients list*/}
                                    <div className="row">
                                            <Form>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>Ingredients:</ControlLabel>
                                                    <FormControl componentClass="textarea" placeholder ="Enter ingredients list" />
                                                </FormGroup>
                                            </Form>
                                    </div>

                                    {/*Form for the cooking instructions*/}
                                    <div className="row">
                                            <Form>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>Instructions:</ControlLabel>
                                                    <FormControl componentClass="textarea" placeholder ="Enter instructions" />
                                                </FormGroup>
                                            </Form>
                                    </div>

                                    <button type="button" class="btn btn-primary">Create</button>
                                    <button type="button" class="btn btn-secondary" onClick={this.handleClick.bind(this)}>Close</button>
                                </OffCanvasMenu>
                            </OffCanvas>
                        </div>

                    </div>
                </div>
            </div>
        );

    }
}

export default Cookbook;