/**
 * Title: Recipe.js
 * Authors: Alexander Haggart
 * Date Created: 11/11/2017
 * Description: This file will load and display a recipe
 */
import React,{ Component } from 'react';
import DBClient from '../classes/AWSDatabaseClient';
import RecipeHelper from '../classes/RecipeHelper';

class Recipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            loaded:false,
            data:'Loading . . . '
        }
        this.setRecipeData = this.setRecipeData.bind(this);
        this.client = new RecipeHelper();
        this.client.loadRecipe([this.props.match.params.recipe],this.setRecipeData)
    }

    setRecipeData(recipeObject){
        this.setState({data:recipeObject,loaded:true})
    }

    render() {
        if(!this.state.loaded) {
            return <div><h1>{this.state.data}</h1></div>
        }
        var ingredients = this.state.data.Ingredients.map((ingredient) => <li><font color={this.state.mousedOver === ingredient ? 'red' : 'black'}>{ingredient}</font></li>)
        var directions = this.state.data.Directions.map((step) => <li>{step}</li>)
        var reviews = this.state.data.Reviews.map((review) => 
            <li>
                <div>
                    <h5 style={{float:'left'}}>{review.username}</h5><img src={'/star.jpg'} height='21' width='21'/>
                </div>
                <p>{review.Comment}</p>
            </li>)
        var dummyReviewObject = {username:'user001',Comment:'new hello world',Rating:'5',timestamp:'-1'}
        return (
            <div>
                <h1>{this.state.data.Name}</h1>
                <button onClick={(e)=>this.client.updateReview(this.state.data.Name,dummyReviewObject)}>U P D A T E</button>
                <h2>Ingredients:</h2>
                <ul>{ingredients}</ul>
                <h2>Directions:</h2>
                <ol>{directions}</ol>
                <h2>Reviews:</h2>
                <ul>{reviews}</ul>
            </div>
            )
    }

}

export default Recipe;