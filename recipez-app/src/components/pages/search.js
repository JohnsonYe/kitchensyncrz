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
import PlannerHelper from '../classes/Planner';
import User from '../classes/User'

import SearchBar from '../SearchComponents/SearchBar'

var client = new SearchHelper();


class Search extends Component {
	constructor(props)  {
		super(props);

        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

		this.test = 'test '
        this.addIngredient = this.addIngredient.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        //{Responses:{Ingredients:[{recipes:{L:[{M:{Name:{S:''}}}]}}]}}
		this.state = {test_field:'Search!',
                        field:'',test_output:null,
                        data_pulled:false,
                        entries:[{value:'',index:0}],
                        ingredients:new Set(),
                        selected:null,
                        morten:"Do something cool?",
                        excluded: new Set(),
                        completions:[],
                        dropdown:{ingredients:false,filters:false},
                        sorted:[],
                    };

        this.mortensButton = this.mortensButton.bind(this);

        this.planner = new PlannerHelper();

        this.user = new User();
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.dropdownState = this.dropdownState.bind(this);
        this.closeAllDropdowns = this.closeAllDropdowns.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReject = this.handleReject.bind(this);
	}
    componentWillMount(){
        window.addEventListener('click', this.closeAllDropdowns);
    }
    componentWillUnmount(){
        window.removeEventListener('click', this.closeAllDropdowns);
    }
    addIngredient(ingredient){
        this.ingredient = ingredient;
    }
    removeIngredient(name,code){
        // e.preventDefault();
        client.updateIngredient(this.ingredient,code,(sorted)=>{
            this.state.ingredients.delete(name)
            this.setState({sorted:sorted,ingredients:this.state.ingredients})
            if(this.state.ingredients.size == 0){
                this.closeAllDropdowns()
            }
        }) 

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
    updateIngredientState(value,status){
        if(status == 1){
            return {ingredients:this.state.ingredients.add(value)}
        } else if(status == 0){
            // alert('got here')
            return {excluded:this.state.excluded.add(value)}
        } else {
            return {}
        }
    }
    handleSubmit(e){
        e.preventDefault();
        let value = this.searchbar.getValue()
        let status = this.searchbar.getStatus()
        client.updateIngredient(value,status,(sorted)=>{
            this.setState({sorted:sorted,...this.updateIngredientState(value,status)})
        })
        this.searchbar.reset();
    }
    handleReject(e){
        let value = this.searchbar.getValue()
        let status = this.searchbar.getStatus()
        client.updateIngredient(value,0,(sorted)=>{
            this.setState({sorted:sorted,excluded:this.state.excluded.add(value)})
        })   
        this.searchbar.reset();     
    }

    mortensButton(){
        this.setState({morten: this.user.client.getUsername()});                                  
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

    render() {
        return (
            <div onClick={this.closeAllDropdowns}>
            <div className="jumbotron">
                <h1>Browse</h1>
            </div>
            <div>
                <h3>{this.state.morten}</h3>
                <button onClick={this.mortensButton}>Mortens Button</button> 
            </div>
            <div className="container-fluid">
                <div id='searchbar-toolbar-container'>
                    <form onSubmit={this.handleSubmit}>
                        <div className='input-group'>
                            <div className={this.dropdownState('ingredients','input-group-btn')} onClick={this.blockPropagation}>
                                <button className='btn btn-default dropdown-toggle' type='button' data-toggle="dropdown" onClick={(e)=>this.toggleDropdown(e,'ingredients')}>
                                    <span className="glyphicon glyphicon-list"></span>
                                </button>
                                <div class="dropdown-menu">
                                    <div className='dropdown-item'>Add From Pantry<span className="pull-right"><span className="glyphicon glyphicon-download-alt"></span></span></div>
                                    <div role="separator" className="dropdown-divider"></div>
                                    <div className="dropdown-header">Added Ingredients</div>
                                    {[...this.state.ingredients].map(
                                        (ingredient)=>
                                        (<div className='dropdown-item' onClick={(e)=>this.removeIngredient(ingredient,-1)}>{ingredient}<span className="pull-right hover-option"><span className="glyphicon glyphicon-remove"></span></span></div>)
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
                            <SearchBar client={client} callback={this.addIngredient} id='searchbar' ref={(searchbar)=>{this.searchbar = searchbar}}/>
                            <span className='input-group-btn'>
                                <button className='btn btn-success' type='button submit'>
                                    <span className="glyphicon glyphicon-plus-sign"></span>
                                </button>
                            </span>
                            <span className='input-group-btn'>
                                <button className='btn btn-danger' type='button' onClick={this.handleReject}>
                                    <span className="glyphicon glyphicon-ban-circle"></span>
                                </button>
                            </span>
                            <div className={this.dropdownState('filters','input-group-btn')} onClick={this.blockPropagation}>
                                <button className='btn btn-info dropdown-toggle' type='button' onClick={(e)=>this.toggleDropdown(e,'filters')}>
                                    <span className="glyphicon glyphicon-filter"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <div role="separator" class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#">Separated link</a>
                                </div>
                            </div>
                        </div>
                    </form>
                    <ul className="list-group">
                        {this.state.sorted.map((recipe)=>(
                            <li className="list-group-item">
                                <a href={'/Recipes/'+recipe[0]}>{recipe[0]}</a>
                                <span className='pull-right'>{'Score: '+JSON.stringify(recipe[1].map((n)=>n.toFixed(2)))}</span>
                            </li>
                        ))}
                        {this.state.sorted.length?null:(<li className='list-group-item'><i>No Recipes to Show</i></li>)}
                    </ul>
                </div>
            </div>
            </div>
        );

    }
}

export default Search;
