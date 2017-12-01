import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import SavedRecipes from "../cookbookComponents/savedRecipes";
import PersonalRecipes from "../cookbookComponents/personalRecipes";
import User from "../classes/User.js";
import {Modal} from 'react-bootstrap';


class Cookbook extends Component {

    constructor(props){
        super(props);
        this.userInstance = User.getUser('user001');
        console.log(this.userInstance);

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
                        <div>

                            {/* Nav bar content here */}
                            <div className="container">
                                <Tabs defaultActiveKey={1}>
                                    <Tab eventKey={1} title={"Saved Recipes"}>
                                        Saved Recipes here
                                        {/* This is where the saved recipes component will be displayed*/}
                                        <SavedRecipes userInstance={this.userInstance}/>
                                    </Tab>
                                    <Tab eventKey={2} title={"Personal Recipes"}>
                                        Personal Recipes here
                                        {/* This is where the personal recipes component will be displayed*/}
                                        <PersonalRecipes userInstance={this.userInstance}/>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );

    }
}

export default Cookbook;