import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import SavedRecipes from "../cookbookComponents/savedRecipes";
import PersonalRecipes from "../cookbookComponents/personalRecipes";
import User from "../classes/User.js";
import Util from "../classes/Util";
import {Modal} from 'react-bootstrap';

/**
 * TODO: Background
 */
class Cookbook extends Component {

    constructor(props){
        super(props);

        this.handleSelect = this.handleSelect.bind(this);

        this.userInstance = User.getUser();

        let navState = Util.parseQueryString(this.props.history.location.search); //parse the URI for info about tab
        this.state = {
            key: +(navState.tab?navState.tab:1), //default to "saved" tab
        }

    }

    handleSelect(key){
        Util.updateURI(this.props.history,'Cookbook',{tab:[key]}) //update the URI so back button works with tabs
        this.setState({key});
    }


    render() {
        return (
            <div>

                <div className="jumbotron">
                    <h1 className="text-white">Cookbook</h1>
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
                                <Tabs activeKey={this.state.key} defaultActiveKey={1} onSelect={this.handleSelect}>
                                    <Tab eventKey={1} title={"Saved Recipes"}>
                                        {/* This is where the saved recipes component will be displayed*/}
                                        <SavedRecipes userInstance={this.userInstance}/>
                                    </Tab>
                                    <Tab eventKey={2} title={"Personal Recipes"}>
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