/**
 * Title: search.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will serve as the browse/search recipe page
 */
import React, { Component } from 'react';
import AWS from 'aws-sdk';

var creds = new AWS.Credentials('AKIAIE53QCYJWP7TMHBQ','oa2r8OnLqfYwndX2Ig4mp8YD6H1WlK2FNOCpJDPJ')
var db = new AWS.DynamoDB({region:'us-east-2',credentials:creds});


class Search extends Component {
	constructor(props)  {
		super(props);

		this.test = 'test '
		this.dataPullTest = this.dataPullTest.bind(this);
		this.state = {test_field:'Search!',field:'',test_output:{Responses:{Ingredients:[{recipes:{L:[{M:{Name:{S:''}}}]}}]}}};
	}
	dataPullTest(e){
		e.preventDefault();
		// this.test = 'clicked the button? ';
		// this.setState({test_field:'clicked button!'})
		var params = {
			RequestItems:{
				"Ingredients":{
					Keys:[
						{
							Name: {
								S: this.state.field
							}
						}
					]
				}
			}
		}
		db.batchGetItem(params,function(err,data){
			if(err){
				this.setState({test_field:'failed :('});
			} else {
				this.setState({test_field:'Success!',test_output:data});
			}
		}.bind(this))
		// alert(this.state.field);
	}
    render() {
    	// alert(JSON.stringify(this.state.test_output))
    	const results = (this.state.test_output.Responses.Ingredients.length ?
    		this.state.test_output.Responses.Ingredients[0].recipes.L : [{M:{Name:{S:'None :('}}}] )
    	const records = results.map((results) => 
    		<tr>
    			<td>{results.M.Name.S}</td>
			</tr>);
		// const records = <tr><td>{JSON.stringify(this.state.test_output)}</td></tr>;
        return (
            <div className="container-fluid">
                <div>Search Team has arrived!</div>
 				<form onSubmit={this.dataPullTest}>
                      <label>
                          {this.state.test_field} 
                          <input type="text" value={this.state.field} onChange={e => this.setState({field:e.target.value})}/>
                      </label>
                      <button>Submit!</button>
            	</form>                
            	<table style={{border:'1px solid black'}}>
	            	<thead>
	                	<th>Found In:</th>
	            	</thead>
              		<tbody>
                		{records ? records : ''}
              		</tbody>
            	</table>
            </div>
        );

    }
}

export default Search;
