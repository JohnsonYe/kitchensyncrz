/**
 * Title: Kitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */

import React, { Component } from 'react';
import { Tab, Nav, NavItem, Modal } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';

import Footer from '../footerComponent/footer'

import User from '../classes/User'
import Autocomplete from '../classes/Autocomplete'
import Util from '../classes/Util'

import SearchBar from '../SearchComponents/SearchBar'

//call loadlist, list , get completion


import {ItemForm, ItemList, ExcludeCookwareForm, ExcludeCookwareList, RestockList } from "../kitchenComponents/constants";

class kitchen extends Component {

    constructor( props ){
        super( props );
        this.user = new User();
        this.autocomplete = Util.loadCompiledAutocompleteTree("Ingredients", "kitchen" );

        this.loadPantry();
        this.loadExcluded();
        this.loadPreference();
        this.loadCookware();

        var
            proteinData = [],
            dairyData = [],
            vegetableData = [],
            grainData = [],
            fruitData = [],
            otherData = [],
            outData = [],
            excludeData = [],
            prefData = [],
            cookwareData = [],
            listData = [];

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
            pref: prefData,
            cookware: cookwareData,

            out: outData,

            list: listData,

            showExclude: false,
            showCookware: false,

            key: "Protein",
            modalKey: "Exclude",

            query:'',
            value:'',
            selection:-1,

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

        this.loadPantry = this.loadPantry.bind(this);
        this.processPantry = this.processPantry.bind(this);

        this.loadExcluded = this.loadExcluded.bind(this);
        this.processExcluded = this.processExcluded.bind(this);

        this.loadPreference = this.loadPreference.bind(this);
        this.processPreference = this.processPreference.bind(this);
        this.prefChanged = this.prefChanged.bind(this);


        this.loadCookware = this.loadCookware.bind(this);
        this.processCookware = this.processCookware.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    internalClient(){
        return new SearchBar.InternalClient();
    }
    handleChange(e) {

        var str = e.target.value;
        if(e.target.value.length > 0) {
            this.autocomplete.then((auto) => { this.setState({list: auto.getCompletion(str)}); })
        }

    }

    // Read the json file
    loadPantry(){
        this.user.getPantry(this.processPantry.bind(this));
    }

    processPantry(data){

        Object.entries(data).forEach((key)=> {

            switch (key[1].unit) {
                case("Protein"):
                    this.addProtein(key[0]);
                    break;
                case("Dairy"):
                    this.addDairy(key[0]);
                    break;
                case("Vegetable"):
                    this.addVegetable(key[0]);
                    break;
                case("Fruit"):
                    this.addFruit(key[0]);
                    break;
                case("Grain"):
                    this.addFruit(key[0]);
                    break;
                case("Other"):
                    this.addOther(key[0]);
                    break;
                case("Restock"):
                    this.addOut(key[0]);
                    break;
                default:
                    break;
            }

        })
    }

    loadExcluded() {
        this.user.getExclusionList(this.processExcluded.bind(this));
    }

    processExcluded(data){
        (data).forEach((key) => {
            this.addExclude(key);
        })
    }

    loadPreference(){
        this.user.getPreferences(this.processPreference.bind(this));
    }

    processPreference(data) {
        var prefs = [];
        (data).forEach((key) => {
            prefs.push(key);
            this.setState({pref: this.state.pref.concat(key)});
        })
    }


    loadCookware(){
        this.user.getCookware(this.processCookware.bind(this));
    }

    processCookware(data){
        (data).forEach((key) => {
            this.addCookware(key);
        })
    }

    getKey(){
        return this.state.key;
    }

    getModalKey(){
        return this.state.modalKey;
    }

    /* Functionality methods */

    handleSelect( key ){
        this.setState({key: key });
    }

    //Protein functions
    addProtein(val){
        this.setState({protein: this.state.protein.concat(val)});
        this.setState({numItems: (++this.state.numItems)});
        this.user.addToPantry(val, "Protein", 1);
    }

    removeProtein(val){

        if( this.state.protein.length > 0 ){
            this.state.protein.splice( this.state.protein.indexOf(val), 1);
            this.setState({numItems: (--this.state.numItems)});
            this.user.removeFromPantry(val);
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
        this.user.addToPantry(val, "Dairy", 1);
    }

    removeDairy(val){
        if( this.state.dairy.length > 0 ){
            this.state.dairy.splice( this.state.dairy.indexOf(val), 1);
            this.setState({numItems: (--this.state.numItems)});
            this.user.removeFromPantry(val);
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
        this.user.addToPantry(val, "Vegetable", 1);
    }

    removeVegetable(val){
        if( this.state.vegetable.length > 0 ){
            this.state.vegetable.splice( this.state.vegetable.indexOf(val), 1);
            this.setState({numItems: (--this.state.numItems)});
            this.user.removeFromPantry(val);
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
        this.user.addToPantry(val, "Fruit", 1);
    }

    removeFruit(val){
        if( this.state.fruit.length > 0 ){
            this.state.fruit.splice( this.state.fruit.indexOf(val), 1);
            this.setState({numItems: (--this.state.numItems)});
            this.user.removeFromPantry(val);
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
        this.user.addToPantry(val, "Grain", 1);
    }

    removeGrain(val){
        if( this.state.grain.length > 0 ){
            this.state.grain.splice( this.state.grain.indexOf(val), 1);
            this.setState({numItems: (--this.state.numItems)});
            this.user.removeFromPantry(val);
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
        this.user.addToPantry(val, "Other", 1);
    }

    removeOther(val){
        if( this.state.other.length > 0 ){
            this.state.other.splice( this.state.other.indexOf(val), 1);
            this.setState({numItems: (--this.state.numItems)});
            this.user.removeFromPantry(val);
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
    prefChanged(newPref) {
        this.user.setPreferences(newPref,  this.setState({pref: newPref}) );
    }


    addExclude(val){
        this.setState({exclude: this.state.exclude.concat(val)});
        this.setState({numExclude: (++this.state.numExclude)});
        this.user.addToExclusionList(val);
    }

    removeExclude(val){
        if( this.state.exclude.length > 0 ){
            this.state.exclude.splice( this.state.exclude.indexOf(val), 1);
            this.setState({numExclude: (--this.state.numExclude)});
            this.user.removeFromExclusionList(val);
        }
    }

    renderExclude(){
        return(
            <div>
                <ExcludeCookwareList
                    items={this.state.exclude}
                    remove={this.removeExclude.bind(this)}
                />
            </div>
        );
    }

    // Cookware functions
    addCookware(val){
        this.setState({cookware: this.state.cookware.concat(val)});
        this.setState({numCookware: (++this.state.numCookware)});
        this.user.addToCookware(val);
    }

    removeCookware(val){
        if( this.state.cookware.length > 0 ){
            this.state.cookware.splice( this.state.cookware.indexOf(val), 1);
            this.setState({numCookware: (--this.state.numCookware)});
            this.user.removeFromCookware(val);
        }
    }

    renderCookware(){
        return(
            <div>
                <ExcludeCookwareList
                    items={this.state.cookware}
                    remove={this.removeCookware.bind(this)}
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
        this.user.addToPantry(val, "Restock", 1);
    }

    returnOut(val){
        if( this.state.out.length > 0 ){
            this.state.out.splice( this.state.out.indexOf(val), 1);
            this.setState({numRestock: (--this.state.numRestock)});
            switch( this.state.key ){
                case "Protein":
                    this.addProtein(val);
                    break;
                case "Dairy":
                    this.addDairy(val);
                    break;
                case "Vegetable":
                    this.addVegetable(val);
                    break;
                case "Fruit":
                    this.addFruit(val);
                    break;
                case "Grain":
                    this.addGrain(val);
                    break;
                case "Other":
                    this.addOther(val);
                    break;
                default:
                    break;
            }

        }
    }

    //Trashing
    removeOut(val){
        if( this.state.out.length > 0 ) {
            this.state.out.splice(this.state.out.indexOf(val), 1);
            this.setState({numRestock: (--this.state.numRestock)});
            this.user.removeFromPantry(val);
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

                    <div className = "row" id = "Modal1">

                        <button
                            className = "btn btn-primary"
                            id="btn-one"
                            title="Preferences"
                            onClick={this.openExclude}
                        >
                            Preferences: &nbsp;{this.state.numExclude}
                        </button>

                        <Modal show={this.state.showExclude} onHide={this.closeExclude}>
                            <Modal.Header>
                                <Modal.Title>Preferences</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                Dietary Preferences:
                                <br />

                                <CheckboxGroup
                                    name="pref"
                                    value={this.state.pref}
                                    onChange={this.prefChanged}
                                    style={{textAlign: 'center'}}>

                                    <label style={{marginRight: '8px'}}><Checkbox value="vegan" /> Vegan </label>
                                    <label style={{marginRight: '8px'}}><Checkbox value="vegetarian" /> Vegetarian </label>
                                    <label style={{marginRight: '8px'}}><Checkbox value="gluten-free" /> Gluten-Free  </label>
                                </CheckboxGroup>

                                <br />
                                Add more items to exclude:
                                <br />

                                <ExcludeCookwareForm
                                    addExclude = {this.addExclude.bind(this)}
                                    addCookware = {this.addCookware.bind(this)}
                                    getModalKey = {this.getModalKey()}
                                />
                                <br />
                                {this.renderExclude()}
                            </Modal.Body>
                            <Modal.Footer>
                                <button className= "btn btn-secondary"
                                        onClick = {this.closeExclude}
                                        title = "Save and Close">
                                    <i className="glyphicon glyphicon-saved" />
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </div>



                    <div className = "row" id = "Modal2">

                        <button
                            className = "btn btn-info"
                            id = "btn-one"
                            title = "Cookware"
                            onClick={this.openCookware}
                        >
                            Cookware: &nbsp;{this.state.cookware.length}
                        </button>

                        <Modal show={this.state.showCookware} onHide={this.closeCookware}>
                            <Modal.Header>
                                <Modal.Title>Cookware</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ExcludeCookwareForm
                                    addExclude = {this.addExclude.bind(this)}
                                    addCookware = {this.addCookware.bind(this)}
                                    getModalKey = {this.getModalKey()}
                                />
                                <br />
                                {this.renderCookware()}
                            </Modal.Body>
                            <Modal.Footer>
                                <button className= "btn btn-secondary"
                                        onClick = {this.closeCookware}
                                        title = "Save and Close">
                                    <i className="glyphicon glyphicon-saved" />
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </div>


                    <div className="row">
                        <h3> Inventory Summary </h3>
                    </div>

                    <div className = "row" >
                        <div className = "col-md-3 col-sm-5 col-xs-5" >
                            <div className = "card mg-3 card-bg-light text-center"
                                 style = {{background: 'aliceblue'}}>
                                <div className = "card-title"><h1>{this.state.numItems}</h1></div>
                                <div className = "card-body"> Total Items: </div>
                            </div>
                        </div>&nbsp;

                        <div className = "col-md-3 col-sm-5 col-xs-5" >
                            <div className = "card mg-3 card-bg-light text-center"
                                 style={{background: 'lightyellow'}}>
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
                                        handleChange = {this.handleChange.bind(this)}
                                        internalClient = {this.internalClient()}
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
                                                Vegetable
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

                        <div className = "col-md-4" style={{background: 'gainsboro'}}>
                            <div className = "container-fluid mg-3">
                                <h3>
                                    <span className="glyphicon glyphicon-alert"></span>
                                    &nbsp; Needs Restock:
                                </h3>
                                <hr />
                                {this.renderOut()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        <Footer />
    }
}

export default kitchen