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
                        morten:"Do something cool?"
                    };
        this.fieldChange = this.fieldChange.bind(this);

        this.mortensButton = this.mortensButton.bind(this);

        this.planner = new PlannerHelper();

        this.user = new User();
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

    mortensButton(){
        this.setState({morten: this.user.client.getUsername()});                                  // THIS WORKS
        //this.setState({morten: this.user.getCookbook()});                                         // THIS WORKS
        // this.user.addToPantry('milk','none',1)                                                   // THIS WORKS
        //this.user.addToCookware('knife')                                                          // THIS WORKS

        //this.user.getPantry(pantry=> this.setState({morten:JSON.stringify(pantry['milk'])}));     // THIS WORKS
        //this.user.getPantry(pantry=> this.setState({morten:JSON.stringify(pantry)}));             // THIS WORKS
        // this.user.getCookbook(cookbook=> this.setState({morten:JSON.stringify(cookbook)}))       // THIS WORKS
        //this.user.addToExclusionList('corn')
        //this.user.removeFromExclusionList('corn')
        //this.user.getCookware(cookware=> this.setState({morten:JSON.stringify(cookware)}));       // THIS WORKS
        this.user.removeFromCookware('spoon');

        //this.user.addToCookbook('pork', 'This is how you do')
        //this.user.removeFromCookbook('pork')

    }

    render() {
    	// alert(JSON.stringify(this.state.test_output))
        var records;
        if(this.state.data_pulled){
        	const results = this.state.test_output
        	records = results.map((result) => <li><Link to={'/Recipes/'+result}>{result}</Link></li>);
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
            <div>
            <div className="jumbotron">
                <h1>Browse</h1>
            </div>
            <div>
                <h3>{this.state.morten}</h3>
                <button onClick={this.mortensButton}>Mortens Button</button> 
            </div>
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
            </div>
        );

    }
}

export default Search;
