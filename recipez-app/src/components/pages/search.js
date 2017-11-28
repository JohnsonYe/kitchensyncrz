/**
 * Title: search.js
 * Author: Andrew Sanchez, Alexander Haggart
 * Date Created: 11/2/2017
 * Description: This file will serve as the browse/search recipe page
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Button,Glyphicon,Form,InputGroup,FormControl,Dropdown,MenuItem} from 'react-bootstrap';
import SearchHelper from '../classes/SearchHelper';
import PlannerHelper from '../classes/Planner';
import SearchBar from '../SearchComponents/SearchBar'

var client = new SearchHelper();


class Search extends Component {
	constructor(props)  {
		super(props);

        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

		this.test = 'test '
        this.dataPullTest = this.dataPullTest.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.dataReciever = this.dataReciever.bind(this);
        //{Responses:{Ingredients:[{recipes:{L:[{M:{Name:{S:''}}}]}}]}}
		this.state = {test_field:'Search!',
                        field:'',test_output:null,
                        data_pulled:false,
                        entries:[{value:'',index:0}],
                        ingredients:new Set(),
                        selected:null,
                        completions:[],
                        dropdown:{ingredients:false}
                    };
        this.fieldChange = this.fieldChange.bind(this);

        this.planner = new PlannerHelper();
        this.textEntry = this.textEntry.bind(this);
        this.autocomplete = this.autocomplete.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.dropdownState = this.dropdownState.bind(this);
        this.closeAllDropdowns = this.closeAllDropdowns.bind(this);



	}
    componentWillMount(){
        window.addEventListener('click', this.closeAllDropdowns);
    }
    componentWillUnmount(){
        window.removeEventListener('click', this.closeAllDropdowns);
    }
	dataPullTest(e){
		e.preventDefault();
        client.relevanceSearch(this.state.field,this.dataReciever,this.state.test_output)
	}
    changeIngredientFocus(ingredient){
        this.setState({selected:ingredient})
    }
    addIngredient(ingredient){
        this.ingredient = ingredient;
        // if(ingredient){
        //     this.state.ingredients.add(ingredient)
        //     this.state.recipeMap = client.relevanceSearch([ingredient],this.dataReciever)
        //     this.setState({field:'',selected:ingredient})
        // }
    }
    removeIngredient(name){
        // e.preventDefault();
        this.state.ingredients.delete(name)
        this.setState({ingredients:this.state.ingredients})
    }
    dataReciever(result){
        if(!result.status){
            this.setState({test_field:'failed :(',test_output:result.payload});
        } else {
            this.setState({test_field:'Success!', test_output:result.payload,data_pulled:true});
        }
    }
    fieldChange(event,index){
        if(index == this.state.entries.length - 1){

        }
    }
    textEntry(base){
        // alert(base)
        this.setState({field:base})
        if(base.length>0){
            client.autocomplete(base,this.autocomplete)
        } else {
            this.setState({completions:[]})
        }
    }
    autocomplete(completions){
        this.setState({completions:completions})
    }
    toggleDropdown(event,id){
        // this.blockPropagation(event)
        // alert(JSON.stringify(Object.keys(event)))
        this.setState({dropdown:Object.assign(this.state.dropdown,{[id]:!this.state.dropdown[id]})})
    }
    blockPropagation(event){
        // alert('got here')
        event.stopPropagation();
    }
    closeAllDropdowns(){
        // alert('got here')
        this.setState({dropdown:{}})
    }
    dropdownState(id,base){
        return (base + (this.state.dropdown[id]?' open':''))
    }
    render() {
    	// alert(JSON.stringify(this.state.test_output))
        var records;
        if(this.state.data_pulled){
        	records = this.state.test_output.map((result) => <li><Link to={'/Recipes/'+result}>{result}</Link></li>);
        } else {
            records = this.state.test_output == null ? 'No Data!' : JSON.stringify(this.state.test_output);
        }
        const ingredient_editor = this.state.selected 
        ? (<div>Selected: {this.state.selected} <button onClick={e => this.removeIngredient(this.state.selected)}>Remove</button></div> ) 
        : (<div>Selected: None</div>);
        return (
            <div onClick={this.closeAllDropdowns}>
            <div className="jumbotron">
                <h1>Browse</h1>
            </div>
            <div className="container-fluid">
                <div id='searchbar-toolbar-container'>
                    <form onSubmit={(e)=>{e.preventDefault();this.searchbar.reset();this.setState({ingredients:this.state.ingredients.add(this.ingredient)})}}>
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
                                        (<div className='dropdown-item' onClick={(e)=>this.removeIngredient(ingredient)}>{ingredient}<span className="pull-right hover-option"><span className="glyphicon glyphicon-remove"></span></span></div>)
                                        )}
                                    {this.state.ingredients.size>0?'':<div className="dropdown-item"><i>You haven't added any ingredients!</i></div>}
                                </div>
                            </div>
                            <SearchBar client={client} callback={this.addIngredient} id='searchbar' ref={(searchbar)=>{this.searchbar = searchbar}}/>
                            <span className='input-group-btn'>
                                <button className='btn btn-success' type='button submit'>
                                    <span className="glyphicon glyphicon-plus-sign"></span>
                                </button>
                            </span>
                            <span className='input-group-btn'>
                                <button className='btn btn-danger' type='button'>
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
                </div>
            </div>
            </div>
        );

    }
}

export default Search;
