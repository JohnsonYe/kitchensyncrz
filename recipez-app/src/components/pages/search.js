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

import SearchBar from '../SearchComponents/SearchBar';

const CLEAR_SEARCH = 99;
const ADD_MULTIPLE = 98;
const MULTI_UPDATE = 97;

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
                    };

        this.recipeLoader = Promise.resolve(new Map()) //set up an async chain for loading recipe info



	}
    getRecipeLoader(){
        return this.recipeLoader;
    }
    massUpdateSearch(items,action,shouldUpdate){
        let getCallbacks = (item,pass,fail)=>{
            return ({
                successCallback: ()=>{pass(item)},
                failureCallback: ()=>{fail(item)},
                outputCallback: shouldUpdate?this.updateLoader:undefined,
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
            //batch load all the ingredients from the URI
            this.client.batchLoadIngredients(Array.from(this.state.ingredients).concat(Array.from(this.state.excluded)))
            // use a promise.all to wait for all ingredients to load asynchronously
            Promise.all(
                //have search manager skip sorting after each update to improve speed
                this.massUpdateSearch(this.state.ingredients,1),this.massUpdateSearch(this.state.excluded,0)
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
    addIngredient(ingredient){
        this.ingredient = ingredient;
    }
    updateState(sortedResults,value,status){

        this.setState({
            sorted:sortedResults,
            ...this.updateIngredientState(value,status)
        },this.updateURI)
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
        this.recipeLoader = this.recipeLoader.then((recipes)=>{
            // console.log('updating loader: '+JSON.stringify(recipes))
            let recipeNames =  Array.from(new Set(ingredient.recipes.map((recipe)=>recipe.Name))); //remove duplicates
            console.log('Loading new ingredient data: ' + ingredient.Name)
            // return (new Promise((pass,fail)=>this.recipeHelper.loadRecipeBatch([ingredient],pass,fail))
            return (new Promise((pass,fail)=>this.recipeHelper.loadRecipeBatch(recipeNames,pass,fail))
                .then((recipeList)=>{
                    // console.log('recipe list: '+JSON.stringify(recipeList));
                    // console.log('recipe map: '+JSON.stringify(recipes));
                    return recipeList.reduce((prev,next)=>prev.set(next.Name,next),recipes);
                })
                .catch((err)=>{console.error('updateLoader: '+err);return recipes}))
        });
        this.recipeLoader.then((recipes)=>this.setState({loadedRecipes:recipes}))
    }
    updateIngredientState(value,status){
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
            return {ingredients:(()=>value.reduce((prev,next)=>prev.add(next),this.state.ingredients))()}
        } else if(status===MULTI_UPDATE){
            return {
                ingredients:(()=>value[0].reduce((prev,next)=>prev.add(next),this.state.ingredients))(),
                excluded:(()=>value[1].reduce((prev,next)=>prev.add(next),this.state.excluded))(),
            }
        } else {
            return {};
        }
    }
    searchUpdateWrapper(value,status){
        return ((sorted)=>this.searchUpdate(sorted,value,status));
    }
    searchUpdate(sorted,value,status){
        this.updateState(sorted,value,status);
        if(this.searchbar){
            this.searchbar.reset();
        }
        console.log('Updated search results: ' + JSON.stringify([value,status]))
    }
    handleSubmit(e){
        e.preventDefault();

        let value = this.searchbar.getValue()
        let status = this.searchbar.getStatus()
        let callbacks = {
            successCallback: this.searchUpdateWrapper(value,status),
            outputCallback: this.updateLoader,
        }
        this.client.updateIngredient(value,status,callbacks)

    }
    updateURI(){
        this.props.history.replace('/Search?'+
                'ingredients='+Array.from(this.state.ingredients).join(',')+
                '&excluded='+Array.from(this.state.excluded).join(',')+
                '&filter='+this.state.filter)
    }
    handleReject(e){
        let value = this.searchbar.getValue()
        let status = this.searchbar.getStatus()
        this.client.updateIngredient(value,0,{successCallback:this.searchUpdateWrapper(value,status)})

    }
    parseQueryString(search){
        return search.substring(1)
            .split('&')
            .map((param)=>(param.split('=')))
            .map((splitParam)=>({[splitParam[0]]:splitParam[1]?splitParam[1].split(',').map((val)=>decodeURIComponent(val)):undefined}))
            .reduce((prev,item)=>Object.assign(item,prev),{})
    }

    setFilter(filter){
        this.closeAllDropdowns()
        this.client.setFilter(filter,this.searchUpdateWrapper())
        this.setState({filter:filter})
    }

    mortensButton2(){
        User.getUser('user001').addToPantry('fish','none',1)
    }

    mortensButton(){
        this.setState({morten: this.user.client.getUsername()});       

        //User.getUser('user001').getPreferences(console.log)
        // console.log(this.state.loadedRecipes.get("Split Pea Soup").Difficulty)
        //this.setState({morten: this.user.getCookbook()});                                                 // THIS WORKS


        //this.user.getPantry(pantry=> this.setState({morten:JSON.stringify(pantry)}));                     // THIS WORKS
        //this.user.getPantry(pantry=> this.setState({morten:JSON.stringify(pantry['milk'])}));             // THIS WORKS
        //this.user.addToPantry('prok','none',1)                                                            // THIS WORKS
        //this.user.removeFromPantry('prok')                                                                // THIS WORKS


        //this.user.getCookbook(cookbook=> this.setState({morten:JSON.stringify(cookbook)}))                // THIS WORKS
        //this.user.addToCookbook('pork', 'This is how you do')                                             // THIS WORKS
        //this.user.removeFromCookbook('pork')                                                              // THIS WORKS


        //this.user.getCookware(cookware=> this.setState({morten:JSON.stringify(cookware)}));               // THIS WORKS
        //this.user.addToCookware('spoon')                                                                  // THIS WORKS
        //this.user.removeFromCookware('spoon');                                                            // THIS WORKS


        //this.user.getExclusionList(exlcude=> this.setState({morten:JSON.stringify(exlcude)}))             // THIS WORKS
        //this.user.addToExclusionList('corn')                                                              // THIS WORKS
        //this.user.removeFromExclusionList('corn')                                                         // THIS WORKS


        //this.user.getShoppingList(shoppingList=> this.setState({morten:JSON.stringify(shoppingList)}))    // THIS WORKS
        //this.user.addToShoppingList('milk')                                                               // THIS WORKS
        //this.user.removeFromShoppingList('milk')                                                          // THIS WORKS

    }

    addFromPantry(e){
        console.log("Adding from user pantry . . .")

        let update_failed_fn = (item)=>{
            //this item couldn't be updated -- probably not found in database
            //return null: the promise.all doesn't care what values we get
            return null;
        };

        //filter each result set ("pantry" and "excluded")
        let filter_failed_results_fn = (items)=>{
            return items.map((pset)=>pset.filter((item)=>!!item)); //check if the item is valid
        };

        //sort the recipe map and update our state with the sorted result
        let sort_results_and_update_fn = (items)=>{
            this.client.sortRecipeMap(this.searchUpdateWrapper(items,MULTI_UPDATE))
        };


        User.getUser(this.user.client.getUsername()).getUserData('pantry').then((data)=> {
            Promise.all(
                //get an array of update promises
                this.massUpdateSearch(Object.keys(data), 1/* ADD */)

                //"map" the array to append .catch() clauses which prevent the Promise.all from aborting
                .map((updatePromise)=>updatePromise.catch(update_failed_fn))
            )
            .then(filter_failed_results_fn)
            .then(sort_results_and_update_fn)
            .catch((err) => console.error(err))


        })
    }

    getGlyph(name){
        return (<span className={"glyphicon glyphicon-"+name}></span>);
    }

    getJustifiedGlyph(name){
        return (<span className="pull-right">{this.getGlyph(name)}</span>);
    }

    getFilterButton(message,icon,filter,largest){
        let glyph = (<span className={"glyphicon glyphicon-"+icon+(largest?" pad-icon":"")}></span>);
        if(!largest){
            glyph = (<span className="pull-right">{glyph}</span>);
        }
        return (<div className={'dropdown-item'+(filter===this.state.filter?' disabled':'')} onClick={(e)=>this.setFilter(filter)}>{message}{glyph}</div>);

    }

    clearSearch(e){
        this.props.history.push('/Search')
        this.client.clear(this.searchUpdateWrapper(null,CLEAR_SEARCH));
        this.closeAllDropdowns();
    }

    render() {
        return (
            <div onClick={this.closeAllDropdowns}>
            <div className="jumbotron">
                <h1>Search</h1>
            </div>
            <div>
                <h3>{this.state.morten}</h3>
                <button onClick={this.mortensButton}>Mortens Button</button>
                <button onClick={this.mortensButton2}>Mortens Button2</button>
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
                                        (<div className='dropdown-item' onClick={(e)=>this.removeIngredient(ingredient,-1)}>{ingredient}<span className="pull-right hover-option">{this.getGlyph('remove')}</span></div>)
                                        )}
                                    {this.state.ingredients.size>0?'':<div className="dropdown-item"><i>You haven't added any ingredients!</i></div>}
                                    <div className="dropdown-header">Excluded Ingredients</div>
                                    {[...this.state.excluded].map(
                                        (ingredient)=>
                                        (<div className='dropdown-item' onClick={(e)=>this.removeIngredient(ingredient,2)}>{ingredient}<span className="pull-right hover-option">{this.getGlyph('remove')}</span></div>)
                                        )}
                                    {this.state.excluded.size>0?'':<div className="dropdown-item"><i>You haven't excluded any ingredients!</i></div>}

                                </div>
                            </div>
                            <SearchBar form={this.refs.form} client={this.client} id='searchbar' ref={(searchbar)=>{this.searchbar = searchbar}}/>
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
                        </div>
                    </form>
                    {/*console.log(this.state.loadedRecipes)*/}
                    <ul className="list-group">
                        {this.state.sorted.map((recipe)=>(
                            <li className="list-group-item">
                                <a href={'/Recipes/'+recipe[0]}>{recipe[0]}</a>
                                <span className='pull-right'>{'Score: '+JSON.stringify(recipe[1].map((n)=>n.toFixed(2)))}</span>
                                {(()=>{ //voodoo magic (IIFE) --> conditionally display recipe info, if it is loaded
                                        let data = this.state.loadedRecipes.get(recipe[0]);
                                        if(data){
                                            return ([
                                                <div>Difficulty: {data.Difficulty}</div>,
                                                <div>Rating:
                                                    {(()=>{ //more voodoo magic
                                                        let result = [],intRating = Math.floor(RecipeHelper.getAvgRating(data));
                                                        for(let i=0;i<this.recipeHelper.maxRating;i++){
                                                            result.push(<span className={"glyphicon glyphicon-star "+(i<intRating?'good-rating':'')}></span>);
                                                        }
                                                        return result;
                                                    })()}
                                                </div>,
                                                <div>{this.getGlyph('time')} <span>{data.TimeCost}</span></div>,
                                            ])
                                        }
                                })()}
                            </li>
                        ))}
                        {this.state.sorted.length?null:(<li className='list-group-item'><i>{'No Recipes to Show'}</i></li>)}
                    </ul>
                </div>
            </div>
            </div>
        );

    }
}

export default Search;
