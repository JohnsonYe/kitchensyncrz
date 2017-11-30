/**
 * Title: search.js
 * Author: Andrew Sanchez, Alexander Haggart
 * Date Created: 11/2/2017
 * Description: This file will serve as the browse/search recipe page
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchHelper from '../classes/SearchHelper';
import PlannerHelper from '../classes/Planner';
import SearchBar from '../SearchComponents/SearchBar'

class Search extends Component {
	constructor(props)  {
		super(props);

        this.client = new SearchHelper();

        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

		this.test = 'test '
        this.addIngredient = this.addIngredient.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        //{Responses:{Ingredients:[{recipes:{L:[{M:{Name:{S:''}}}]}}]}}
        let query = this.parseQueryString(this.props.history.location.search)
		this.state = {  ingredients:new Set(query.ingredients?query.ingredients:[]),
                        excluded: new Set(query.excluded?query.excluded:[]),
                        completions:[],
                        dropdown:{ingredients:false,filters:false},
                        sorted:[],
                    };
        if(this.state.ingredients.size||this.state.excluded.size){
            //batch load all the ingredients from the URI
            this.client.batchLoadIngredients(Array.from(this.state.ingredients).concat(Array.from(this.state.excluded)))
            // use a promise.all to wait for all ingredients to load asynchronously
            Promise.all(
                Array.from(this.state.ingredients).map((ingredient)=>{
                        return new Promise((pass,fail)=>{
                            this.client.updateIngredient(ingredient,1,()=>{pass(ingredient)},(name)=>{fail(name)},true)
                    })
                }),
                Array.from(this.state.excluded).map((excluded)=>{
                        return new Promise((pass,fail)=>{
                            this.client.updateIngredient(excluded,0,()=>{pass(excluded)},(name)=>{fail(name)},true)
                    })
                })
            )
            .catch((err)=>alert('failed'))
            .then((result)=>{this.client.sortRecipeMap((sorted)=>this.setState({sorted:sorted}))})
        }
        //NEED TO SET STATUS AFTER UPDATE
        this.planner = new PlannerHelper();
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
        this.client.updateIngredient(name,code,(sorted)=>{
            if(code==-1){
                this.state.ingredients.delete(name)
            } else {
                this.state.excluded.delete(name)
            }
            this.setState({sorted:sorted,ingredients:this.state.ingredients,excluded:this.state.excluded},this.updateURI)
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
        this.client.updateIngredient(value,status,(sorted)=>{
            this.setState({sorted:sorted,...this.updateIngredientState(value,status)},this.updateURI)
            this.searchbar.reset();
        })
        
    }
    updateURI(){
        this.props.history.replace('/Search?'+
                'ingredients='+Array.from(this.state.ingredients).join(',')+
                '&excluded='+Array.from(this.state.excluded).join(','))
    }
    handleReject(e){
        let value = this.searchbar.getValue()
        let status = this.searchbar.getStatus()
        this.client.updateIngredient(value,0,(sorted)=>{
            this.setState({sorted:sorted,excluded:this.state.excluded.add(value)},this.updateURI)
            this.searchbar.reset();
        })   
             
    }
    parseQueryString(search){
        return search.substring(1)
            .split('&')
            .map((param)=>(param.split('=')))
            .map((splitParam)=>({[splitParam[0]]:splitParam[1]?splitParam[1].split(',').map((val)=>decodeURIComponent(val)):undefined}))
            .reduce((prev,item)=>Object.assign(item,prev),{})
    }
    render() {
        return (
            <div onClick={this.closeAllDropdowns}>
            <div className="jumbotron">
                <h1>Search</h1>
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
                                    <div className='dropdown-item' onClick={(e)=>this.props.history.push('/Search')}>Clear All<span className="pull-right"><span className="glyphicon glyphicon-trash"></span></span></div>
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
                            <SearchBar client={this.client} callback={this.addIngredient} id='searchbar' ref={(searchbar)=>{this.searchbar = searchbar}}/>
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
                            <div className={this.dropdownState('filters','input-group-btn')+' no-wrap-dropdown'} onClick={this.blockPropagation}>
                                <button className='btn btn-info dropdown-toggle' type='button' onClick={(e)=>this.toggleDropdown(e,'filters')}>
                                    <span className="glyphicon glyphicon-filter"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <div className='dropdown-item' onClick={(e)=>this.props.history.push('/Search')}>Import Preferences<span className="glyphicon glyphicon-download-alt pad-icon"></span></div>
                                    <div className='dropdown-item' onClick={(e)=>this.props.history.push('/Search')}>Filter by Time<span className="pull-right"><span className="glyphicon glyphicon-time"></span></span></div>
                                    <div className='dropdown-item' onClick={(e)=>this.props.history.push('/Search')}>Filter by Rating<span className="pull-right"><span className="glyphicon glyphicon-star"></span></span></div>
                                    <div className='dropdown-item' onClick={(e)=>this.props.history.push('/Search')}>Filter by Cost<span className="pull-right"><span className="glyphicon glyphicon-piggy-bank"></span></span></div>
                                    <div className='dropdown-item' onClick={(e)=>this.props.history.push('/Search')}>Filter by Difficulty<span className="pull-right"><span className="glyphicon glyphicon-sunglasses"></span></span></div>
                                    <div className='dropdown-item' onClick={(e)=>this.props.history.push('/Search')}>Filter by Cookware<span className="pull-right"><span className="glyphicon glyphicon-cutlery"></span></span></div>
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
                        {this.state.sorted.length?null:(<li className='list-group-item'><i>{'No Recipes to Show'}</i></li>)}
                    </ul>
                </div>
            </div>
            </div>
        );

    }
}

export default Search;
