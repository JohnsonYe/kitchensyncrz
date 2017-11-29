import React, { Component } from 'react';
import SavedRecipes from "../cookbookComponents/savedRecipes";
import PersonalRecipes from "../cookbookComponents/personalRecipes";
import NewRecipe from "../cookbookComponents/newPersonalRecipe";
import { Tabs, Tab, FormGroup, FormControl, Form, ControlLabel } from 'react-bootstrap';


class Cookbook extends Component {

    constructor(props){
        super(props);

        this.renderRow = this.renderRow.bind(this);
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

    renderRow(){



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
                            <NewRecipe />
                        </div>

                    </div>
                </div>
            </div>
        );

    }
}

export default Cookbook;