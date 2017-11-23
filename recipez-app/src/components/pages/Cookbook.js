import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import SavedRecipes from "../cookbookComponents/savedRecipes";
import PreviewCard from "../cookbookComponents/previewCard";



class Cookbook extends Component {

    constructor(props){
        super(props);

        this.renderRow = this.renderRow.bind(this);
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
                                    </Tab>
                                </Tabs>
                            </div>

                        </div>

                        {/* TODO: Swing-out personal recipe edit/create area */}
                        <div className="col-md-3">

                        </div>

                    </div>
                </div>
            </div>
        );

    }
}

export default Cookbook;