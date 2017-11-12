/**
 * Title: Recipe.js
 * Authors: Alexander Haggart
 * Date Created: 11/11/2017
 * Description: This file will load and display a recipe
 */
import React,{ Component } from 'react';
import DBClient from '../classes/AWSDatabaseClient';

class Recipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            loaded:false,
            data:'Loading . . . '
        }
        this.setData = this.setData.bind(this);
        this.client = DBClient.getClient();
        this.client.getDBItems('Recipes',[this.props.match.params.recipe],this.setData)
    }

    setData(response){
        if(!response.status){
            //do nothing? or try again
            return;
        }

        this.setState({data:response.payload.Responses.Recipes[0],loaded:true})
    }

    render() {
        if(!this.state.loaded) {
            return <div><h1>{this.state.data}</h1></div>
        }
        var ingredients = this.state.data.Ingredients.L.map((ingredient) => <li>{ingredient.S}</li>)
        var directions = this.state.data.Directions.L.map((step) => <li>{step.S}</li>)
        return (
            <div>
                <h1>{this.state.data.Name.S}</h1>
                <h2>Ingredients:</h2>
                <ul>{ingredients}</ul>
                <h2>Directions:</h2>
                <ol>{directions}</ol>
            </div>
            )
    }

}

export default Recipe;