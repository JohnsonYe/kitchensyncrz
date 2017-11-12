/**
 * Title: search.js
 * Author: Andrew Sanchez, Alexander Haggart
 * Date Created: 11/2/2017
 * Description: This file will serve as the browse/search recipe page
 */
import React, { Component } from 'react';
import AWS from 'aws-sdk';
import DBClient from '../classes/AWSDatabaseClient';
import SearchHelper from '../classes/SearchHelper';

var client = new SearchHelper(new DBClient());


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
                        selected:null
                    };
        this.fieldChange = this.fieldChange.bind(this);
	}
	dataPullTest(e){
		e.preventDefault();
        client.relevanceSearch(this.state.field,this.dataReciever,this.state.test_output)
	}
    changeIngredientFocus(ingredient){
        this.setState({selected:ingredient})
    }
    addIngredient(e){
        e.preventDefault();
        if(this.state.field != ''){
            this.state.ingredients.add(this.state.field)
            this.state.recipeMap = client.relevanceSearch([this.state.field],this.dataReciever)
            this.setState({field:'',selected:this.state.field})
        }
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
    render() {
    	// alert(JSON.stringify(this.state.test_output))
        var records;
        if(this.state.data_pulled){
        	const results = this.state.test_output
        	records = results.map((results) => <li onClick={e => alert("Not Implemented !!")}>{results}</li>);
        } else {
            records = this.state.test_output == null ? 'No Data!' : JSON.stringify(this.state.test_output);
        }
        var ingredient_list = []
        this.state.ingredients.forEach((ingredient) => ingredient_list.push(<li onClick={e => this.changeIngredientFocus(ingredient)}>{ingredient}</li>))
		// const records = <tr><td>{JSON.stringify(this.state.test_output)}</td></tr>;
        const entry_list = this.state.entries.map( (entry) => 
                <label>
                    <input type="text" value={entry.value} onChange={e => this.fieldChange(e,entry.index)}/>
                </label>
            )
        const ingredient_editor = this.state.selected 
        ? (<div>Selected: {this.state.selected} <button onClick={e => this.removeIngredient(this.state.selected)}>Remove</button></div> ) 
        : (<div>Selected: None</div>);
        return (
            <div className="container-fluid">
                <div>Search Team has arrived!</div>
 				<form onSubmit={this.addIngredient}>
                      <label>
                          <input type="text" value={this.state.field} onChange={e => this.setState({field:e.target.value})}/>
                      </label>
                      <button>Add!</button>
            	</form>  
                {/* "modify ingredient" UI element  */}    
                {ingredient_editor}         
            	<table style={{border:'1px solid black'}}>
	            	<thead>
                        <tr>
                            <th>Ingredients:</th>
    	                	<th>Best Matches:</th>
                        </tr>
	            	</thead>
              		<tbody>
                        <tr>
                            <td valign='top'>
                                <ul>
                                    {ingredient_list}
                                </ul>
                            </td>
                            <td>
                                <ol>
                	               {records ? records : ''}
                                </ol>
                            </td>
                        </tr>
              		</tbody>
            	</table>
            </div>
        );

    }
}

export default Search;
