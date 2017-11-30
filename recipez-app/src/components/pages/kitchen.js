/**
 * Title: Kitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';
import { Jumbotron, Tab, Nav, NavItem, Modal, Button } from 'react-bootstrap';

import User from '../classes/User'

const AddItem = ({item, remove, addOut}) => {

    return (

        <form>
            <div className="form-control" id="del">
                {item}
                <button className = "btn btn-danger"
                        id = "delBtn"
                        type = "button"
                        onClick = {()=> remove(item)}
                        style = {{float:'right', display:'block'}}>

                    <i className = "glyphicon glyphicon-trash" />
                </button>
                <button className = "btn btn-warning"
                        id = "delBtn"
                        type = "button"
                        onClick = {()=> addOut(item) }
                        style={{float:'right', display:'block'}}>
                    <i className = "glyphicon glyphicon-ban-circle" />
                </button>
            </div>

        </form>
    );
}

const AddRestock = ({item, remove, addBack}) => {

    return (

        <form>
            <div className="form-control" id="del">
                {item}
                <button className = "btn btn-danger btn-lg"
                        id = "delBtn"
                        type = "button"
                        onClick = {()=> remove(item.id)}
                        style = {{float:'right', display:'block'}}>

                    <i className = "glyphicon glyphicon-trash" />
                </button>
                <button className = "btn btn-success btn-lg"
                        id = "delBtn"
                        type = "button"
                        onClick = {()=> addBack(item) }
                        style={{float:'right', display:'block'}}>
                    <i className = "glyphicon glyphicon-plus" />
                </button>
            </div>

        </form>
    );
}

const ItemList = ( {items, remove, addOut} ) => {

    // Map through nodes
    const itemNode = items.map((item)=>
        (<AddItem item = {item}
                  key={item.id}
                  remove={remove}
                  addOut={addOut}
         />));

    return (<div> {itemNode}  </div>);
}

const RestockList = ( {items, remove, addBack} ) => {
    const itemNode = items.map( (item) =>
        (<AddRestock item = {item}
                     key={item.id}
                     remove={remove}
                     addBack = {addBack} />));

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
                        <button className="btn btn-success"
                                type="submit"
                                onClick = {this.user.addToPantry('potato', 'none', 1)}>
                            <i className = "glyphicon glyphicon-plus" />
                        </button>
                </span>
            </div>
        </form>
    );
};

const ECAdd = ({addExclude, addCookware, getModalKey}) => {

    // Input Tracker
    let input;

    return (
        // Add to the form
        <form onSubmit={(e) => {
            e.preventDefault();

            // Preventing empty answers
            if( input.value !== '') {

                alert( getModalKey );
                if( getModalKey == "Exclude" ) {
                    addExclude(input.value);
                }else if( getModalKey == "Cookware"){
                    addCookware(input.value);
                }

                // Clearing
                input.value = '';
            }
        }}>

            <div className="input-group">
                <input className="form-control" type= "text" id = "enter"
                       autocomplete="off"
                       placeholder="Add"
                       ref={node => { input = node; }} />

                <span className = "input-group-btn">
                        <button className="btn btn-success" type="submit">
                            <i className = "glyphicon glyphicon-plus" />
                        </button>
                </span>
            </div>
        </form>
    );
}

class kitchen extends Component {

    constructor( props ){
        super( props );

        this.user = new User();
        
        var
            proteinData = [],
            dairyData = [],
            vegetableData = [],
            grainData = [],
            fruitData = [],
            otherData = [],
            outData = [],
            excludeData = [],
            cookwareData = [];

        this.state = {
            numItems: 0,
            numRestock: 0,
            numExclude: 0,

            protein: proteinData,
            dairy: dairyData,
            vegetable: vegetableData,
            grain: grainData,
            fruit: fruitData,
            other: otherData,
            exclude: excludeData,
            cookware: cookwareData,

            out: outData,

            showExclude: false,
            showCookware: false,

            key: "Protein",
            modalKey: "Exclude"

        };

        this.getKey = this.getKey.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.getModalKey = this.getModalKey.bind(this);

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

        // Handle Restock List
        this.addOut = this.addOut.bind(this);
        this.removeOut = this.removeOut.bind(this);
        this.returnOut = this.returnOut.bind(this);
        this.renderOut = this.renderOut.bind(this);

        // Preferences Modal
        this.openExclude = this.openExclude.bind(this);
        this.closeExclude = this.closeExclude.bind(this);

        //Cookware Modal
        this.openCookware = this.openCookware.bind(this);
        this.closeCookware = this.closeCookware.bind(this);

        // Exclude List
        this.addExclude = this.addExclude.bind(this);
        this.removeExclude = this.removeExclude.bind(this);
        this.renderExclude = this.renderExclude.bind(this);

        //Cookware List
        this.addCookware = this.addCookware.bind(this);
        this.removeCookware = this.removeCookware.bind(this);
        this.renderCookware = this.renderCookware.bind(this);
    }

    getKey(){
        return this.state.key;
    }

    getModalKey(){
        return this.state.modalKey;
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
            this.state.protein.splice( this.state.protein.indexOf(e), 1);
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderProtein(){
        return(
            <div>
                <ItemList
                    items={this.state.protein}
                    remove={this.removeProtein.bind(this)}
                    addOut={this.addOut.bind(this)}
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
            this.state.dairy.splice( this.state.dairy.indexOf(e), 1);
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderDairy(){
        return(
            <div>
                <ItemList
                    items={this.state.dairy}
                    remove={this.removeDairy.bind(this)}
                    addOut={this.addOut.bind(this)}
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
            this.state.vegetable.splice( this.state.vegetable.indexOf(e), 1);
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderVegetable(){
        return(
            <div>
                <ItemList
                    items={this.state.vegetable}
                    remove={this.removeVegetable.bind(this)}
                    addOut={this.addOut.bind(this)}
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
            this.state.fruit.splice( this.state.fruit.indexOf(e), 1);
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderFruit(){
        return(
            <div>
                <ItemList
                    items={this.state.fruit}
                    remove={this.removeFruit.bind(this)}
                    addOut={this.addOut.bind(this)}
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
            this.state.grain.splice( this.state.grain.indexOf(e), 1);
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderGrain(){
        return(
            <div>
                <ItemList
                    items={this.state.grain}
                    remove={this.removeGrain.bind(this)}
                    addOut={this.addOut.bind(this)}
                />
            </div>
        );
    }

    // Other functions
    addOther(val){
        this.setState({other: this.state.other.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
    }

    removeOther(e){
        if( this.state.other.length > 0 ){
            this.state.other.splice( this.state.other.indexOf(e), 1);
            this.setState({numItems: (--this.state.numItems)});
        }
    }

    renderOther(){
        return(
            <div>
                <ItemList
                    items={this.state.other}
                    remove={this.removeOther.bind(this)}
                    addOut={this.addOut.bind(this)}
                />
            </div>
        );
    }

    // Exclude functions
    addExclude(val){
        this.setState({exclude: this.state.exclude.concat(val)});
        this.setState({numExclude: (++this.state.numExclude)});
    }

    removeExclude(e){
        if( this.state.exclude.length > 0 ){
            this.state.exclude.splice( this.state.exclude.indexOf(e), 1);
            this.setState({numExclude: (--this.state.numExclude)});
        }
    }

    renderExclude(){
        return(
            <div>
                <ItemList
                    items={this.state.exclude}
                    remove={this.removeExclude.bind(this)}
                    addOut={this.addOut.bind(this)}
                />
            </div>
        );
    }

    // Cookware functions
    addCookware(val){
        this.setState({cookware: this.state.cookware.concat(val)});
        this.setState({numCookware: (++this.state.numCookware)});
    }

    removeCookware(e){
        if( this.state.cookware.length > 0 ){
            this.state.cookware.splice( this.state.cookware.indexOf(e), 1);
            this.setState({numCookware: (--this.state.numCookware)});
        }
    }

    renderCookware(){
        return(
            <div>
                <ItemList
                    items={this.state.cookware}
                    remove={this.removeCookware.bind(this)}
                    addOut={this.addOut.bind(this)}
                />
            </div>
        );
    }

    // Add to the Restock List
    addOut(val){
        this.setState({out: this.state.out.concat(val)});
        this.setState({numRestock: (++this.state.numRestock)});
        switch( this.state.key ){
            case "Protein":
                this.removeProtein(val);
                break;
            case "Dairy":
                this.removeDairy(val);
                break;
            case "Vegetable":
                this.removeVegetable(val);
                break;
            case "Fruit":
                this.removeFruit(val);
                break;
            case "Grain":
                this.removeGrain(val);
                break;
            case "Other":
                this.removeOther(val);
                break;
            default:
                break;
        }
    }

    returnOut(e){
        if( this.state.out.length > 0 ){
            this.state.out.splice( this.state.out.indexOf(e), 1);
            this.setState({numRestock: (--this.state.numRestock)});
            switch( this.state.key ){
                case "Protein":
                    this.addProtein(e);
                    break;
                case "Dairy":
                    this.addDairy(e);
                    break;
                case "Vegetable":
                    this.addVegetable(e);
                    break;
                case "Fruit":
                    this.addFruit(e);
                    break;
                case "Grain":
                    this.addGrain(e);
                    break;
                case "Other":
                    this.addOther(e);
                    break;
                default:
                    break;
            }

        }
    }

    //Trashing
    removeOut(e){
        if( this.state.out.length > 0 ) {
            this.state.out.splice(this.state.out.indexOf(e), 1);
            this.setState({numRestock: (--this.state.numRestock)});
        }
    }

    renderOut(){
        return(
            <div>
                <RestockList
                    items={this.state.out}
                    remove={this.removeOut.bind(this)}
                    addBack={this.returnOut.bind(this)}
                />
            </div>
        );
    }

    /**Method that opens Modal*/
    openExclude() {
        this.setState( {modalKey: "Exclude" });
        this.setState( {showExclude: true} );
    }

    /**Method that closes modal*/
    closeExclude() {
        this.setState( {showExclude: false} );
    }

    /**Method that opens Modal*/
    openCookware() {
        this.setState( {modalKey: "Cookware"} );
        this.setState( {showCookware: true} );
    }

    /**Method that closes modal*/
    closeCookware() {
        this.setState( {showCookware: false} );
    }


    render() {

        return(

            <div>

                <div className="jumbotron">
                    <h1>Kitchen</h1>
                </div>

                <div className="container">

                    <div id = "Modal">

                        <Button
                            bsStyle="secondary"
                            bsSize="large"
                            onClick={this.openExclude}
                        >
                            Preferences: {this.state.numExclude}
                        </Button>

                        <Modal show={this.state.showExclude} onHide={this.closeExclude}>
                            <Modal.Header>
                                <Modal.Title>Preferences</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <label class="checkbox-inline"><input type="checkbox"/> Vegan </label>
                                <label class="checkbox-inline"><input type="checkbox"/> Vegetarian </label>
                                <label class="checkbox-inline"><input type="checkbox"/> Gluten-Free </label>
                                <br />
                                <ECAdd
                                    addExclude = {this.addExclude.bind(this)}
                                    addCookware = {this.addCookware.bind(this)}
                                    getModalKey = {this.getModalKey()}
                                />
                                {this.renderExclude()}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.closeExclude}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div className = "row" id = "Modal">

                        <Button
                            bsStyle="primary"
                            bsSize="large"
                            onClick={this.openCookware}
                        >
                            Cookware
                        </Button>

                        <Modal show={this.state.showCookware} onHide={this.closeCookware}>
                            <Modal.Header>
                                <Modal.Title>Cookware</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ECAdd
                                    addExclude = {this.addExclude.bind(this)}
                                    addCookware = {this.addCookware.bind(this)}
                                    getModalKey = {this.getModalKey()}
                                />
                                {this.renderCookware()}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.closeCookware}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div className="row">
                        <h3> Inventory Summary </h3>
                    </div>

                    <div className = "row" >
                        <div className = "col-md-3 col-sm-5 col-xs-5" >
                            <div className = "card mg-3 card-bg-light text-center">
                                <div className = "card-title"><h1>{this.state.numItems}</h1></div>
                                <div className = "card-body"> Total Items: </div>
                            </div>
                        </div>&nbsp;

                        <div className = "col-md-3 col-sm-5 col-xs-5" >
                            <div className = "card mg-3 card-bg-light text-center">
                                <div className = "card-title"><h1>{this.state.numRestock}</h1></div>
                                <div className = "card-body"> Restock: </div>
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
                                    <div className="col-xs-4 col-sm-4 col-md-3">
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
                                    <div className="col-xs-8 col-sm-8 col-md-9" id = "tabs">
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
                                <h3> Needs Restock: </h3>
                                {this.renderOut()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default kitchen