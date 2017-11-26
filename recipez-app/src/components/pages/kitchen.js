/**
 * Title: Kitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';
import { Jumbotron, Row, Col, Tab, Nav, NavItem } from 'react-bootstrap';

//Components
import FoodItems from '../kitchenComponents/pantry'
import CookwareItems from '../kitchenComponents/cookware'
import Excluded from '../kitchenComponents/exclude'

import card from '../pages/kitchenPages/kitchenComponents'

class kitchen extends Component {

    render() {

        return(

            <div>

                <Jumbotron>
                    <h1>Kitchen</h1>
                </Jumbotron>

                <div className="container">

                    <div className="row">
                        <h3> Inventory Summary </h3>
                    </div>

                    <div className = "row" >
                        <div className = "col-md-3 col-sm-5" >
                            <div className = "card mg-3 card-bg-light text-center">
                                <div className = "card-title"><h1>0</h1></div>
                                <div className = "card-body"> Total Items: </div>
                            </div>
                        </div>&nbsp;

                        <div className = "col-md-3 col-sm-5" >
                            <div className = "card mg-3 card-bg-light text-center">
                                <div className = "card-title"><h1>2</h1></div>
                                <div className = "card-body"> Needs Restock: </div>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className = "row">

                        <div className = "col-md-8" >

                            <div className="form-group">
                                <input type="text" className="form-control" id="add"/>
                            </div>


                            <Tab.Container id="left-tabs-example" defaultActiveKey="Protein">
                                <div className="row">
                                    <div className="col-sm-3 col-md-2">
                                        <Nav bsStyle="pills" stacked>
                                            <NavItem eventKey="Protein">
                                                Protein
                                            </NavItem>
                                            <NavItem eventKey="Dairy">
                                                Dairy
                                            </NavItem>
                                            <NavItem eventKey="Vegetable">
                                                Vegetables
                                            </NavItem>
                                            <NavItem eventKey="Grain">
                                                Grain
                                            </NavItem>
                                            <NavItem eventKey="Fruit">
                                                Fruit
                                            </NavItem>
                                            <NavItem eventKey="Other">
                                                Other
                                            </NavItem>
                                        </Nav>
                                    </div>
                                    <div className="col-sm-9 col-md-10">
                                        <Tab.Content animation>
                                            <Tab.Pane eventKey="Protein">
                                                Protein
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Dairy">
                                                Dairy
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Vegetable">
                                                Vegetable
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Grain">
                                                Grain
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Fruit">
                                                Fruit
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Other">
                                                Other
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </div>
                            </Tab.Container>


                        </div>

                        <div className = "col-md-4" >
                            <div className = "container-fluid mg-3">

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default kitchen