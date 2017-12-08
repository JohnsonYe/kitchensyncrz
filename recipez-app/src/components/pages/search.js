/**
 * Title: search.js
 * Author: Andrew Sanchez, Alexander Haggart
 * Date Created: 11/2/2017
 * Description: This file will serve as the browse/search recipe page
 */
// Morten trying to learn how this works...

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchHelper from '../classes/SearchHelper';
import RecipeHelper from '../classes/RecipeHelper';
import PlannerHelper from '../classes/Planner';
import User from '../classes/User';
import Util from '../classes/Util'

import SearchBar from '../SearchComponents/SearchBar';
import SearchThumbnail from '../SearchComponents/SearchThumbnail';

const CLEAR_SEARCH = 99;
const ADD_MULTIPLE = 98;

class Search extends Component {
    constructor(props)  {
        super(props);

        this.client = new SearchHelper();
        this.recipeHelper = new RecipeHelper();

        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

        this.test = 'test '
        this.addIngredient = this.addIngredient.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);

        this.mortensButton = this.mortensButton.bind(this);
        this.mortensButton2 = this.mortensButton2.bind(this);

        this.toggleThumbnails = this.toggleThumbnails.bind(this);

        this.planner = new PlannerHelper();

        this.user = User.getUser();

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.dropdownState = this.dropdownState.bind(this);
        this.closeAllDropdowns = this.closeAllDropdowns.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReject = this.handleReject.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.getFilterButton = this.getFilterButton.bind(this);

        this.clearSearch = this.clearSearch.bind(this);

        this.updateLoader = this.updateLoader.bind(this);

        this.addFromPantry = this.addFromPantry.bind(this);

        this.getRecipeLoader = this.getRecipeLoader.bind(this);

        this.getGlyph = this.getGlyph.bind(this);
        this.getJustifiedGlyph = this.getJustifiedGlyph.bind(this);


        //{Responses:{Ingredients:[{recipes:{L:[{M:{Name:{S:''}}}]}}]}}
        let query = this.parseQueryString(this.props.history.location.search)
        console.log('query parse: '+JSON.stringify(query))
        this.state = {  ingredients:new Set(query.ingredients?query.ingredients:[]),
            excluded: new Set(query.excluded?query.excluded:[]),
            filter:query.filter?query.filter[0]:'least_additional',
            morten:"Do something cool?",
            completions:[],
            dropdown:{ingredients:false,filters:false},
            sorted:[],
            loadedRecipes:new Map(),
            viewThumbnails: true
        };

        this.recipeLoader = Promise.resolve(new Map()) //set up an async chain for loading recipe info

        this.comingSoon = ['Filter by Cookware','Filter by Cost'];



    }
    getRecipeLoader(){
        return this.recipeLoader;
    }
    massUpdateSearch(items,action,shouldLoad){
        let getCallbacks = (item,pass,fail)=>{
            return ({
                successCallback: ()=>{pass(item)},
                outputCallback: shouldLoad?((ingredient)=>this.updateLoader(ingredient)):undefined,
                failureCallback: ()=>{fail(item)},
            });
        };

        return Array.from(items).map((item)=>{
            return new Promise((pass,fail)=>{
                this.client.updateIngredient(item,action,getCallbacks(item,pass,fail),true)
            })
        })
    }
    componentWillMount(){
        window.addEventListener('click', this.closeAllDropdowns);
        this.client.setRecipeLoaderSource(this.getRecipeLoader); //pass the client an anonymous function that gives it the most recent loader
        if(this.state.ingredients.size||this.state.excluded.size){
            this.startLoading();
            //batch load all the ingredients from the URI
            this.client.batchLoadIngredients(Array.from(this.state.ingredients).concat(Array.from(this.state.excluded)))
            // use a promise.all to wait for all ingredients to load asynchronously
            Promise.all(
                //have search manager skip sorting after each update to improve speed
                this.massUpdateSearch(this.state.ingredients,1,false),this.massUpdateSearch(this.state.excluded,0,false)
            )
                .catch((err)=>console.error(err))
                //do one sort once everything is done loading
                .then((result)=>{ //get the loaded recipes and load them in one batch, then pass the result
                    this.recipeLoader = new Promise((pass,fail)=>this.recipeHelper.loadRecipeBatch(this.client.getRecipeList().map((entry)=>entry[0]),pass,fail))
                        .then((recipeList)=>new Map(recipeList.map((recipe)=>[recipe.Name,recipe]))); //convert list of named objects to a map
                    this.recipeLoader //attach clause to the loader that sets the state and logs it once loaded
                        .then((recipes)=>{
                            this.setState({loadedRecipes:recipes},
                                (done)=>console.log('batch loaded: '+this.state.loadedRecipes));
                            return recipes
                        })
                    // .then((recipes)=>{console.log(JSON.stringify(this.state.loadedRecipes));return recipes})
                    this.setFilter(this.state.filter) //set the helper's filter method, based on whatever we parsed
                    return result //pass the result to the next link
                })
                .then((result)=>this.client.sortRecipeMap((sorted)=>this.setState({sorted:sorted})))
        }
    }
    componentWillUnmount(){
        window.removeEventListener('click', this.closeAllDropdowns);
    }
    startLoading(){
        this.setState({loading:true});
    }
    doneLoading(){
        this.setState({loading:false});
    }
    addIngredient(ingredient){
        this.ingredient = ingredient;
    }
    removeIngredient(value,status){
        // e.preventDefault();
        let update_state_and_close_dropdowns_fn = (sorted)=>{
            this.updateState(sorted,value,status);
            if(this.state.ingredients.size === 0){
                this.closeAllDropdowns()
            }
        };

        this.client.updateIngredient(value,status,{successCallback:update_state_and_close_dropdowns_fn})

    }
    toggleDropdown(event,id){
        this.setState({dropdown:Object.assign(this.state.dropdown,{[id]:!this.state.dropdown[id]})})
    }
    blockPropagation(event){
        event.stopPropagation();
    }
    closeAllDropdowns(){
        this.setState({dropdown:{}})
    }
    dropdownState(id,base){
        return (base + (this.state.dropdown[id]?' open':''))
    }
    updateLoader(ingredient){
        // console.log('Loading info for: ' + ingredient)
        this.startLoading();
        this.recipeLoader = this.recipeLoader.then((recipes)=>{
            // console.log('updating loader: '+JSON.stringify(recipes))
            let recipeNames =  Array.from(new Set(ingredient.recipes.map((recipe)=>recipe.Name))); //remove duplicates
            console.log('Loading new ingredient data: ' + ingredient.Name)
            // return (new Promise((pass,fail)=>this.recipeHelper.loadRecipeBatch([ingredient],pass,fail))
            return (new Promise((pass,fail)=>this.recipeHelper.loadRecipeBatch(recipeNames,pass,fail))
                .then((recipeList)=>{
                    // console.log('recipe list: '+JSON.stringify(recipeList));
                    // console.log('recipe map: '+JSON.stringify(recipes));
                    this.doneLoading();
                    console.log(recipeList);
                    return recipeList.reduce((prev,next)=>prev.set(next.Name,next),recipes);
                })
                .catch((err)=>{console.error('loader update error: '+err);this.doneLoading();return recipes}));
        });
        this.recipeLoader.then((recipes)=>this.setState({loadedRecipes:recipes}))
    }
    handleReject(e){ //events from the "reject" button on the toolbar
        let value = this.searchbar.getValue(); //get the searchbar state
        let status = this.searchbar.getStatus();
        this.client.updateIngredient(value,0,{successCallback:this.searchUpdateWrapper(value,status)})

    }
    handleSubmit(e){ //catch form submission events from the searchbar element and the "add" button
        this.startLoading();
        e.preventDefault();

        //check the searchbar state for state-specific handling
        let value = this.searchbar.getValue()
        let status = this.searchbar.getStatus()
        let callbacks = {
            successCallback: this.searchUpdateWrapper(value,status),
            outputCallback: this.updateLoader,
        }
        this.client.updateIngredient(value,status,callbacks)

    }
    searchUpdateWrapper(value,status){ //getter function for specific ingredient values and update types
        return ((sorted)=>this.searchUpdate(sorted,value,status));
    }
    searchUpdate(sorted,value,status){ //update the page based on search results
        this.updateState(sorted,value,status); //update the lists based on the type of update
        if(this.searchbar){ //reset the searchbar
            this.searchbar.reset();
        }
        console.log('Updated search results: ' + JSON.stringify([value,status]))
    }
    updateState(sortedResults,value,status){
        this.setState({
            sorted:sortedResults,
            ...this.updateIngredientState(value,status), //get updated include and exclude information
            loading:false,
        },this.updateURI) //update the uri once visual update completes
    }
    updateIngredientState(value,status){ //modify our copy of the ingredient and exlcude lists based on the value and status given
        if(status === 1){ //adding an ingredient to search -- we should load the data too
            return {ingredients:this.state.ingredients.add(value)};
        } else if(status===-1){
            return {ingredients:(()=>{this.state.ingredients.delete(value);return this.state.ingredients})()};
        } else if(status === 0){
            return {excluded:this.state.excluded.add(value)};
        } else if(status===2){
            return {excluded:(()=>{this.state.excluded.delete(value);return this.state.excluded})()};
        } else if(status===CLEAR_SEARCH){
            return {excluded:new Set(),ingredients:new Set()};
        } else if(status===ADD_MULTIPLE){
            console.log('got here');
            return {ingredients:(()=>value.reduce((prev,next)=>prev.add(next),this.state.ingredients))()}
        } else {
            return {};
        }
    }
    updateURI(){ //update the uri with the current include, exclude, and filter settings
        this.props.history.replace('/Search?'+
            'ingredients='+Array.from(this.state.ingredients).join(',')+
            '&excluded='+Array.from(this.state.excluded).join(',')+
            '&filter='+this.state.filter)
    }
    parseQueryString(search){
        return search.substring(1)
            .split('&')
            .map((param)=>(param.split('=')))
            .map((splitParam)=>({[splitParam[0]]:splitParam[1]?splitParam[1].split(',').map((val)=>decodeURIComponent(val)):undefined}))
            .reduce((prev,item)=>Object.assign(item,prev),{})
    }

    setFilter(filter){
        this.startLoading();
        this.closeAllDropdowns();
        this.setState({filter:filter}); //set our state to reflect the current filter state
        if(filter === "custom"){ //special actions based on user preferences
            this.doneLoading(); //not currently implemented
        } else {
            //set the filter type and pass the helper and handle for updating the state with new search ordering
            this.client.setFilter(filter,this.searchUpdateWrapper());  
        }

    }

    //debugging functions
    mortensButton2(){
        User.getUser('user001').addToPantry('fish','none',1)
    }

    mortensButton(){
        this.setState({morten: this.user.client.getUsername()});

        Util.loadCompiledAutocompleteTree('Combined','morten')
            // .then((auto)=>auto.dumpTree())
            .then((auto)=>console.log(auto.getCompletion('')))
    }

    toggleThumbnails(){ //toggle the image thumbnail view for results
        this.setState({ viewThumbnails: !this.state.viewThumbnails })
    }

    /**
     * add a batch of ingredients from the user pantry and exclude list
     * @param {Event} e click event generated by the add button, we don't really care about the info
     */
    addFromPantry(e){
        console.log("Adding from user pantry . . .")

        let update_failed_fn = (item)=>{
            //this item couldn't be updated -- probably not found in database
            //return null: the promise.all doesn't care what values we get
            return null;
        };

        let filter_failed_results_fn = (items)=>{
            return items.filter((item)=>!!item); //check if the item is valid
        };

        let sort_results_and_update_fn = (items)=>{ 
            //have the client compile and sort the search results, then update our state through the normal pathway
            this.client.sortRecipeMap(this.searchUpdateWrapper(items,ADD_MULTIPLE))
        };

        User.getUser(this.user.client.getUsername()).getUserData('pantry').then((data)=>{
            Promise.all(

                //get an array of update promises
                this.massUpdateSearch(Object.keys(data),1/* ADD */,true)
                //"map" the array to append .catch() clauses which prevent the Promise.all from aborting
                    .map((updatePromise)=>updatePromise.catch(update_failed_fn))
            )
            .then( filter_failed_results_fn )
            .then( sort_results_and_update_fn )
            .catch((err)=>console.error(err))
        })
    }

    getGlyph(name){ //bootstrap glyphicon convenience function
        return (<span className={"glyphicon glyphicon-"+name}></span>);
    }

    getJustifiedGlyph(name){ //justified glyphicon convenience function
        return (<span className="pull-right">{this.getGlyph(name)}</span>);
    }

    /**
     * get a clickable dropdown item for each filter type
     * @param  {String} message the text to display for each dropdown item
     * @param  {String} icon    the name of the glyphicon to use for this button
     * @param  {String} filter  the name of the filter that this button sets
     * @param  {boolean} largest set to true if this button has the longest 
     *                           string (necessary for proper wrapping)
     *                           
     * @return {JSX <div>}         <div> element compatible with bootstrap 
     *                             dropdowns containing filter setting functionality
     */
    getFilterButton(message,icon,filter,largest){
        let glyph = (<span className={"glyphicon glyphicon-"+icon+(largest?" pad-icon":"")}></span>);
        if(!largest){
            glyph = (<span className="pull-right">{glyph}</span>);
        }
        return (<div className={'dropdown-item'+(filter===this.state.filter?' disabled':'')} onClick={(e)=>this.setFilter(filter)}>{message}{glyph}</div>);

    }

    clearSearch(e){ //clear ingredient and exclude lists, search results and close all dropdowns
        this.props.history.push('/Search')
        this.client.clear(this.searchUpdateWrapper(null,CLEAR_SEARCH));
        this.closeAllDropdowns();
    }

    render() {
        return (
            <div onClick={this.closeAllDropdowns}>
            <div className="jumbotron">
                <h1 className="text-white">Search</h1>
            </div>
            <div className="container-fluid">
                <div id='searchbar-toolbar-container'>
                    <form onSubmit={this.handleSubmit} ref="form">
                        <div className='input-group'>
                            <div className={this.dropdownState('ingredients','input-group-btn')} onClick={this.blockPropagation}>
                                <button className='btn btn-default dropdown-toggle' type='button' data-toggle="dropdown" onClick={(e)=>this.toggleDropdown(e,'ingredients')}>
                                    {this.getGlyph('list')}
                                </button>
                                <div className="dropdown-menu">
                                    <div className='dropdown-item' onClick={this.addFromPantry}>
                                        Add From Pantry{this.getJustifiedGlyph('download-alt')}
                                    </div>
                                    <div role="separator" className="dropdown-divider"></div>
                                    <div className='dropdown-item' onClick={this.clearSearch}>
                                        Clear All{this.getJustifiedGlyph('trash')}
                                    </div>
                                    <div role="separator" className="dropdown-divider"></div>
                                    <div className="dropdown-header">Added Ingredients</div>
                                    {[...this.state.ingredients].map(
                                        (ingredient)=>
                                        (<div className='dropdown-item' key={ingredient} onClick={(e)=>this.removeIngredient(ingredient,-1)}>{ingredient}<span className="pull-right hover-option">{this.getGlyph('remove')}</span></div>)
                                        )}
                                        {this.state.ingredients.size>0?'':<div className="dropdown-item"><i>You haven't added any ingredients!</i></div>}
                                        <div className="dropdown-header">Excluded Ingredients</div>
                                        {[...this.state.excluded].map(
                                            (ingredient)=>
                                                (<div className='dropdown-item' onClick={(e)=>this.removeIngredient(ingredient,2)}>{ingredient}<span className="pull-right hover-option"><span className="glyphicon glyphicon-remove"></span></span></div>)
                                        )}
                                        {this.state.excluded.size>0?'':<div className="dropdown-item"><i>You haven't excluded any ingredients!</i></div>}

                                </div>
                            </div>
                            <SearchBar form={this.refs.form} client={this.client} id='searchbar' ref={(searchbar)=>{this.searchbar = searchbar}} canExclude/>
                            <span className='input-group-btn'>
                                <button className='btn btn-success' type='button submit'>
                                    {this.getGlyph('plus-sign')}
                                </button>
                            </span>
                            <span className='input-group-btn'>
                                <button className='btn btn-danger' type='button' onClick={this.handleReject}>
                                    {this.getGlyph('ban-circle')}
                                </button>
                            </span>
                            <div className={this.dropdownState('filters','input-group-btn')+' no-wrap-dropdown'} onClick={this.blockPropagation}>
                                <button className='btn btn-info dropdown-toggle' type='button' onClick={(e)=>this.toggleDropdown(e,'filters')}>
                                    {this.getGlyph('filter')}
                                </button>
                                <div className="dropdown-menu dropdown-menu-right">
                                    {this.getFilterButton('Import Preferences','download-alt','custom')}
                                    {this.getFilterButton('Filter by Least Additional','ok','least_additional',true)}
                                    {this.getFilterButton('Filter by Best Match','signal','best_match')}
                                    {this.getFilterButton('Filter by Time','time','time_filter')}
                                    {this.getFilterButton('Filter by Cost','piggy-bank','cost_filter')}
                                    {this.getFilterButton('Filter by Rating','star','rating_filter')}
                                    {this.getFilterButton('Filter by Difficulty','sunglasses','difficulty_filter')}
                                    {this.getFilterButton('Filter by Cookware','cutlery','cookware_filter')}
                                </div>
                            </div>
                            <span className='input-group-btn'>
                                <button className='btn btn-warning' type='button' onClick={this.toggleThumbnails} title="Toggle View Mode">
                                    <span className={this.state.viewThumbnails ? "glyphicon glyphicon-font" : "glyphicon glyphicon-picture"}></span>
                                </button>
                            </span>
                        </div>
                    </form>
                    {this.state.viewThumbnails ?
                    <div className="container-fluid search-results">
                        <div className="row">
                        {this.state.sorted.map((recipe)=>{
                            let data = this.state.loadedRecipes.get(recipe[0]);
                            if(data){
                                return(
                                <SearchThumbnail key={recipe[0]} data={data} />
                                );
                            }
                        })     
                        }
                        {this.state.sorted.length?null:(<li className='list-group-item'><i>{'No Recipes to Show'}</i></li>)}
                        </div>
                    </div> : 
                     <ul className="list-group search-results">
                        {this.state.sorted.map((recipe)=>(
                            <li className="list-group-item">
                                <Link to={'/Recipes/'+recipe[0]}>{recipe[0]}</Link>
                                {(()=>{// (IIFE) --> conditionally display recipe info, if it is loaded
                                    let data = this.state.loadedRecipes.get(recipe[0]);
                                    if(data){
                                        return ([
                                            <div>Difficulty: {data.Difficulty == "Undefined"? "Medium": data.Difficulty}</div>,
                                            <div>Rating: 
                                                {(()=>{ 
                                                    let result = [],intRating = Math.floor(RecipeHelper.getAvgRating(data));
                                                    for(let i=0;i<this.recipeHelper.maxRating;i++){
                                                        result.push(<span className={"glyphicon glyphicon-star "+(i<intRating?'good-rating':'')}></span>);
                                                    }
                                                    return result;
                                                })()}
                                            </div>,
                                            <div>{this.getGlyph('time')} <span>{data.TimeCost == "Undefined"? "1 h" :data.TimeCost}</span></div>,
                                        ])
                                    }
                                })()}
                            </li>
                        ))}
                        {this.state.sorted.length?null:(<li className='list-group-item'><i>{'No Recipes to Show'}</i></li>)}
                    </ul>
                    
                    }
                </div>
            </div>
            </div>
        );

    }
}

export default Search;