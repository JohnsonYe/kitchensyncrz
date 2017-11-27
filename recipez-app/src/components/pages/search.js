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
    removeIngredient(e){
        // e.preventDefault();
        this.state.ingredients.delete(this.state.selected)
        this.setState({selected:null})
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
    toggleDropdown(id){
        this.setState({dropdown:Object.assign(this.state.dropdown,{[id]:!this.state.dropdown[id]})})
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
        var ingredient_list = []
        this.state.ingredients.forEach((ingredient) => ingredient_list.push(<li onClick={e => this.changeIngredientFocus(ingredient)}>{ingredient}</li>))
		// const records = <tr><td>{JSON.stringify(this.state.test_output)}</td></tr>;
        // var completion_list = this.state.completions.map((completion)=><li>{completion}</li>) 
        // var completion_list = this.state.completions.map((completion)=><option value={completion}/>) 
        // const entry_list = this.state.entries.map( (entry) => 
        //         <label>
        //             <input type="text" value={entry.value} onChange={e => this.fieldChange(e,entry.index)}/>
        //         </label>
        //     )
        const ingredient_editor = this.state.selected 
        ? (<div>Selected: {this.state.selected} <button onClick={e => this.removeIngredient(this.state.selected)}>Remove</button></div> ) 
        : (<div>Selected: None</div>);
        return (
            <div>
            <div className="jumbotron">
                <h1>Browse</h1>
            </div>
            <div className="container-fluid">
                <div>
                    <form onSubmit={(e)=>{e.preventDefault();this.searchbar.reset();this.setState({ingredients:this.state.ingredients.add(this.ingredient)})}}>
                        <div className='input-group'>
                            <div className={this.dropdownState('ingredients','input-group-btn')}>
                                <button className='btn btn-default dropdown-toggle' type='button' data-toggle="dropdown" onClick={(e)=>this.toggleDropdown('ingredients')}>
                                    <span className="glyphicon glyphicon-list"></span>
                                </button>
                                <div class="dropdown-menu">
                                    {[...this.state.ingredients].map((ingredient)=>(<div className='dropdown-item'>{ingredient}</div>))}
                                    <div role="separator" class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#">Separated link</a>
                                </div>
                            </div>
                            <SearchBar client={client} callback={this.addIngredient} id='searchbar' ref={(searchbar)=>{this.searchbar = searchbar}}/>
                            <span className='input-group-btn'>
                                <button className='btn btn-success' type='button'>
                                    <span className="glyphicon glyphicon-plus-sign"></span>
                                </button>
                            </span>
                            <span className='input-group-btn'>
                                <button className='btn btn-danger' type='button'>
                                    <span className="glyphicon glyphicon-ban-circle"></span>
                                </button>
                            </span>
                            <div className={this.dropdownState('filters','input-group-btn')}>
                                <button className='btn btn-info dropdown-toggle' type='button' onClick={(e)=>this.toggleDropdown('filters')}>
                                    <span className="glyphicon glyphicon-filter"></span>
                                </button>
                                <div class="dropdown-menu">
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

    oldBootstrapStuff(){
        return (               
            <InputGroup>
                <InputGroup.Button>
                    {/*<Button bsStyle='success'><Glyphicon glyph='list'/></Button>*/}
                    <Dropdown id='ingredient-dropdown'>
                        <Dropdown.Toggle noCaret>
                            <Glyphicon glyph='list'/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <MenuItem eventkey='1'>test</MenuItem>
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup.Button>
                <SearchBar client={client} callback={this.addIngredient} id='searchbar'/>
                <InputGroup.Button><Button bsStyle='info'><Glyphicon glyph='plus-sign'/></Button></InputGroup.Button>
                <InputGroup.Button><Button bsStyle='danger'><Glyphicon glyph='ban-circle'/></Button></InputGroup.Button>

            </InputGroup>
        )
    }
}

export default Search;
