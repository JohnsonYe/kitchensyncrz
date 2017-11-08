/**
 * Title: search.js
 * Author: Andrew Sanchez, Alexander Haggart
 * Date Created: 11/2/2017
 * Description: This file will serve as the browse/search recipe page
 */
import React, { Component } from 'react';
import AWS from 'aws-sdk';

//these need to go somewhere else eventaully
var creds = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-2:7da319d0-f8c8-4c61-8c2a-789a751341aa',
});
AWS.config.update({region:'us-east-2',credentials:creds});
var db = new AWS.DynamoDB();


class Search extends Component {
	constructor(props)  {
		super(props);

		this.test = 'test '
		this.dataPullTest = this.dataPullTest.bind(this);
        //{Responses:{Ingredients:[{recipes:{L:[{M:{Name:{S:''}}}]}}]}}
		this.state = {test_field:'Search!',field:'',test_output:null,data_pulled:false};
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
				this.setState({test_field:'failed :(',test_output:err});
			} else {
				this.setState({test_field:'Success!',test_output:data,data_pulled:true});
			}
		}.bind(this))
		// alert(this.state.field);
	}
    render() {
    	// alert(JSON.stringify(this.state.test_output))
        var records;
        if(this.state.data_pulled){
        	const results = (this.state.test_output.Responses.Ingredients.length ?
        		this.state.test_output.Responses.Ingredients[0].recipes.L : [{M:{Name:{S:'None :('}}}] )
        	records = results.map((results) => 
        		<tr>
        			<td>{results.M.Name.S}</td>
    			</tr>);
        } else {
            records = this.state.test_output == null ? 'No Data!' : JSON.stringify(this.state.test_output);
        }
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
