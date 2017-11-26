/**
 * Title: Recipe.js
 * Authors: Alexander Haggart
 * Date Created: 11/11/2017
 * Description: This file will load and display a recipe
 */
import React,{ Component } from 'react';
import RecipeHelper from '../classes/RecipeHelper';

import User from '../classes/User'

class Recipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            loaded:false,
            data:'Loading . . . '
        }
        this.setRecipeData = this.setRecipeData.bind(this);
        this.updateReviews = this.updateReviews.bind(this);
        this.client = new RecipeHelper();
        this.client.loadRecipe(this.props.match.params.recipe,this.setRecipeData,this.props.match.params.user)
    }

    setRecipeData(recipeObject,err){
        if(!recipeObject){
            // alert(JSON.stringify(this))
            const notFound = this.props.match.params.recipe.toString()+' not found :('
            this.setState({data:err,loaded:false})
            // alert(notFound)
            return
        }
        this.setState({data:recipeObject,loaded:true})
    }

    updateReviews(response){
        this.setState({data:this.state.data})
    }

    render() {
        if(!this.state.loaded) {
            return <div><h1>{this.state.data}</h1></div>
        }
        var ingredients = this.state.data.Ingredients.map((ingredient) => <li><span color={this.state.mousedOver === ingredient ? 'red' : 'black'}>{ingredient}</span></li>)
        var directions = this.state.data.Directions.map((step) => <li>{step}</li>)
        // alert(JSON.stringify(this.state.data))
        var reviews = Object.entries(this.state.data.Reviews?this.state.data.Reviews:{}).map((review) => 
            <li>
                <div>
                    <h5 style={{float:'left'}}>{review[1].username}</h5><img src={'/star.jpg'} height='21' width='21'/>
                </div>
                <p>{review[1].Comment}</p>
            </li>)
        var dummyReviewObject = {username:'user001',Comment:'new hello world',Rating:'5',timestamp:'-1'}
        return (
            <div>
                <h1>{this.state.data.Name}</h1>
                <button onClick={(e)=>this.client.updateReview(this.state.data.Name,dummyReviewObject,this.updateReviews)}>U P D A T E</button>
                <button onClick={(e)=>User.getUser('user001').getUserData('cookbook').then((data)=>alert(JSON.stringify(data)))}>check</button>
                <button onClick={(e)=>User.getUser('user001').saveExternalRecipe(this.state.data.Name)}>add to cookbook</button>
                <button onClick={(e)=>User.getUser('user001').deleteRecipe(this.state.data.Name)}>remove from cookbook</button>
                <h2>Ingredients:</h2>
                <ul>{ingredients}</ul>
                <h2>Directions:</h2>
                <ol>{directions}</ol>
                <h2>Reviews:</h2>
                <ul>{reviews}</ul>
                <h2>JSON:</h2>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
            )
    }

}

export default Recipe;