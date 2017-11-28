/**
 * Title: Kitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';
import { Jumbotron, Tab, Nav, NavItem } from 'react-bootstrap';
import DynamicList from "../dynamicList";

//Components
import FoodItems from '../kitchenComponents/pantry'
import CookwareItems from '../kitchenComponents/cookware'
import Excluded from '../kitchenComponents/exclude'

import card from '../pages/kitchenPages/kitchenComponents'

const AddItem = ({item, remove}) => {

    return (
        <div className="form-control">
            {item}
            <button id="remove"
                    type="submit"
                    onClick={()=> remove(item.id)}>X</button>
        </div>
    );
}

const ItemList = ( {items, remove} ) => {

    // Map through nodes
    const itemNode = items.map((item)=>
        (<AddItem item = {item} key={item.id} remove={remove} />));

    return (<div id ="gap"> {itemNode} </div>);
}

const ItemForm = ({addProtein}) => {

        // Input Tracker
        let input;

        return (

            // Add to the form
            <form onSubmit={(e) => {
                e.preventDefault();

                // Preventing empty answers
                if( input.value !== '') {
                    addProtein(input.value);

                    // Clearing
                    input.value = '';
                }
            }}>

                <div class="input-group">
                    <input className="form-control col-md-12" type= "text"
                           ref={node => { input = node; }} />

                    <button class="add" type="submit" id="add">
                        +
                    </button>
                </div>
            </form>
        );
    };

class kitchen extends Component {

    constructor( props ){
        super( props );
        var
            proteinData = [],
            dairyData = [],
            veggieData = [],
            grainData = [],
            fruitData = [],
            otherData = [];

        this.state = {
            pCount: 0,
            dCount: 0,
            vCount: 0,
            gCount: 0,
            fCount: 0,
            oCount: 0,
            numItems: 0,
            numRestock: 0,

            protein: proteinData,
            dairy: dairyData,
            veggie: veggieData,
            grain: grainData,
            fruit: fruitData,
            other: otherData,

        };

        this.addProtein = this.addProtein.bind(this);
        this.removeProtein = this.removeProtein.bind(this);
        this.renderProtein = this.renderProtein.bind(this);
    }

    /* Functionality methods */

    addProtein(val){
        this.setState({protein: this.state.protein.concat(val)});
        this.setState({pCount: (++this.state.pCount)});
        this.setState({numItems: (++this.state.numItems)});

    }

    removeProtein(e){
        if( this.state.pCount > 0 ){
            this.state.protein.splice( this.state.protein.indexOf(e));
            this.setState({pCount: (--this.state.pCount)});
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderProtein(){

        return(
            <div>
                <ItemList
                    items={this.state.protein}
                    remove={this.removeProtein.bind(this)}
                />
            </div>

        );
    }

    render() {

        return(

            <div>

                <div className="jumbotron">
                    <h1>Kitchen</h1>
                </div>

                <div className="container">

                    <div className="row">
                        <h3> Inventory Summary </h3>
                    </div>

                    <div className = "row" >
                        <div className = "col-md-3 col-sm-5" >
                            <div className = "card mg-3 card-bg-light text-center">
                                <div className = "card-title"><h1>{this.state.numItems}</h1></div>
                                <div className = "card-body"> Total Items: </div>
                            </div>
                        </div>&nbsp;

                        <div className = "col-md-3 col-sm-5" >
                            <div className = "card mg-3 card-bg-light text-center">
                                <div className = "card-title"><h1>{this.state.numRestock}</h1></div>
                                <div className = "card-body"> Needs Restock: </div>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className = "row">

                        <div className = "col-md-8" >

                            <div className = "container-fluid">
                                <div className="input-group">
                                    <ItemForm addProtein = {this.addProtein.bind(this)}/>
                                </div>


                                {this.renderProtein()}

                            </div>

                            <Tab.Container id="left-tabs-example" defaultActiveKey="Protein">
                                <div className="row clearfix">
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