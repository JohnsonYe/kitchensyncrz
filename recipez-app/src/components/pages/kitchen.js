/**
 * Title: Kitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';
import { Jumbotron, Tab, Nav, NavItem } from 'react-bootstrap';

const AddItem = ({item, remove}) => {

    return (

        <form className="form-inline">
            <div className="form-control btn-group col-11" id="del">
                {item}
                <button className = "btn btn-danger btn-lg mg-3"
                        id = "delBtn"
                        type = "submit"
                        onClick = {()=> remove(item.id)}
                        style = {{float:'right', display:'block'}}>

                    <i className = "glyphicon glyphicon-trash" />
                </button>
                <button className = "btn btn-warning btn-lg mg-3"
                        id = "delBtn"
                        type = "button"
                        onClick = { this.className = "btn btn-danger btn-lg mg-3 disabled"}
                        style={{float:'right', display:'block'}}>
                    <i className = "glyphicon glyphicon-ban-circle" />
                </button>
            </div>

        </form>
    );
}

const ItemList = ( {items, remove} ) => {

    // Map through nodes
    const itemNode = items.map((item)=>
        (<AddItem item = {item} key={item.id} remove={remove} />));

    return (<div> {itemNode}  </div>);
}

const ItemForm = ( {addProtein,
                      addDairy,
                      addVegetable,
                      addFruit,
                      addGrain,
                      addOther,
                      getKey} ) => {

    // Input Tracker
    let input;

    return (
        // Add to the form
        <form onSubmit={(e) => {
            e.preventDefault();

            // Preventing empty answers
            if( input.value !== '') {

                // Call the add function for each group
                switch( getKey ){
                    case "Protein":
                        addProtein(input.value);
                        break;
                    case "Dairy":
                        addDairy(input.value);
                        break;
                    case "Vegetable":
                        addVegetable(input.value);
                        break;
                    case "Fruit":
                        addFruit(input.value);
                        break;
                    case "Grain":
                        addGrain(input.value);
                        break;
                    case "Other":
                        addOther(input.value);
                        break;
                    default:
                        break;
                }

                // Clearing
                input.value = '';
            }
        }}>

            <div className="input-group">
                <input className="form-control" type= "text" id = "enter"
                       autocomplete="off"
                       placeholder="Add to Pantry"
                       ref={node => { input = node; }} />

                <span className = "input-group-btn">
                        <button className="btn btn-success" type="submit">
                            <i className = "glyphicon glyphicon-plus" />
                        </button>
                    </span>
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
            vegetableData = [],
            grainData = [],
            fruitData = [],
            otherData = [];

        this.state = {
            numItems: 0,
            numRestock: 0,

            protein: proteinData,
            dairy: dairyData,
            vegetable: vegetableData,
            grain: grainData,
            fruit: fruitData,
            other: otherData,

            key: "Protein"

        };

        this.getKey = this.getKey.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        // Protein
        this.addProtein = this.addProtein.bind(this);
        this.removeProtein = this.removeProtein.bind(this);
        this.renderProtein = this.renderProtein.bind(this);

        // Dairy
        this.addDairy = this.addDairy.bind(this);
        this.removeDairy = this.removeDairy.bind(this);
        this.renderDairy = this.renderDairy.bind(this);

        // Veggies
        this.addVegetable = this.addVegetable.bind(this);
        this.removeVegetable = this.removeVegetable.bind(this);
        this.renderVegetable = this.renderVegetable.bind(this);

        // Fruit
        this.addFruit = this.addFruit.bind(this);
        this.removeFruit = this.removeFruit.bind(this);
        this.renderFruit = this.renderFruit.bind(this);

        // Grain
        this.addGrain = this.addGrain.bind(this);
        this.removeGrain = this.removeGrain.bind(this);
        this.renderGrain = this.renderGrain.bind(this);

        // Other
        this.addOther = this.addOther.bind(this);
        this.removeOther = this.removeOther.bind(this);
        this.renderOther = this.renderOther.bind(this);
    }

    getKey(){
        return this.state.key;
    }

    /* Functionality methods */

    handleSelect( key ){
        this.setState({key: key });;
    }

    //Protein functions
    addProtein(val){
        this.setState({protein: this.state.protein.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
    }

    removeProtein(e){
        if( this.state.protein.length > 0 ){
            this.state.protein.splice( this.state.protein.indexOf(e));
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    outProtein(e){
        if( this.state.protein.length > 0 ){

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

    // Dairy functions
    addDairy(val){
        this.setState({dairy: this.state.dairy.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
    }

    removeDairy(e){
        if( this.state.dairy.length > 0 ){
            this.state.dairy.splice( this.state.dairy.indexOf(e));
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderDairy(){
        return(
            <div>
                <ItemList
                    items={this.state.dairy}
                    remove={this.removeDairy.bind(this)}
                />
            </div>
        );
    }

    // Vegetable functions
    addVegetable(val){
        this.setState({vegetable: this.state.vegetable.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
    }

    removeVegetable(e){
        if( this.state.vegetable.length > 0 ){
            this.state.vegetable.splice( this.state.vegetable.indexOf(e));
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderVegetable(){
        return(
            <div>
                <ItemList
                    items={this.state.vegetable}
                    remove={this.removeVegetable.bind(this)}
                />
            </div>
        );
    }

    // Fruit functions
    addFruit(val){
        this.setState({fruit: this.state.fruit.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
    }

    removeFruit(e){
        if( this.state.fruit.length > 0 ){
            this.state.fruit.splice( this.state.fruit.indexOf(e));
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderFruit(){
        return(
            <div>
                <ItemList
                    items={this.state.fruit}
                    remove={this.removeFruit.bind(this)}
                />
            </div>
        );
    }

    // Grain functions
    addGrain(val){
        this.setState({grain: this.state.grain.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
    }

    removeGrain(e){
        if( this.state.grain.length > 0 ){
            this.state.grain.splice( this.state.grain.indexOf(e));
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderGrain(){
        return(
            <div>
                <ItemList
                    items={this.state.grain}
                    remove={this.removeGrain.bind(this)}
                />
            </div>
        );
    }

    // Other functions
    addOther(val){
        this.setState({grain: this.state.other.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
    }

    removeOther(e){
        if( this.state.other.length > 0 ){
            this.state.other.splice( this.state.other.indexOf(e));
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderOther(){
        return(
            <div>
                <ItemList
                    items={this.state.other}
                    remove={this.removeOther.bind(this)}
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
                                    <ItemForm
                                        addProtein = {this.addProtein.bind(this)}
                                        addDairy = {this.addDairy.bind(this)}
                                        addVegetable = {this.addVegetable.bind(this)}
                                        addFruit = {this.addFruit.bind(this)}
                                        addGrain = {this.addGrain.bind(this)}
                                        addOther = {this.addOther.bind(this)}
                                        getKey = {this.getKey()}
                                    />
                                </div>
                            </div>

                            <br />

                            <Tab.Container defaultActiveKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
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
                                            <NavItem eventKey="Fruit">
                                                Fruit
                                            </NavItem>
                                            <NavItem eventKey="Grain">
                                                Grain
                                            </NavItem>
                                            <NavItem eventKey="Other">
                                                Other
                                            </NavItem>
                                        </Nav>
                                    </div>
                                    <div className="col-sm-9 col-md-10" id = "tabs">
                                        <Tab.Content animation>
                                            <Tab.Pane eventKey="Protein">
                                                {this.renderProtein()}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Dairy">
                                                {this.renderDairy()}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Vegetable">
                                                {this.renderVegetable()}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Fruit">
                                                {this.renderFruit()}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Grain">
                                                {this.renderGrain()}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Other">
                                                {this.renderOther()}
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