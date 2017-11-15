/**
 * Title: RecipeHelper.js
 * Authors: Alexander Haggart
 * Date Created: 11/14/2017
 * Description: This file will interact with the DBClient to handle Recipe-related actions
 */
import React from 'react';
import DBClient from '../classes/AWSDatabaseClient';

 class RecipeHelper{
    constructor(){
        this.client = DBClient.getClient();

        this.loadRecipe = this.loadRecipe.bind(this);
        this.receiveRecipe = this.receiveRecipe.bind(this);
        this.unpackRecipe = this.unpackRecipe.bind(this);
        this.updateReview = this.updateReview.bind(this);
    }

    updateReview(recipeName,revObj){
        //re-pack the review object
        var packedReviewObject = {L:[{M:{
                username:{S:revObj.username},
                Comment:{S:revObj.Comment},
                Rating:{N:revObj.Rating},
                timestamp:{N:revObj.timestamp},
            }
        }]}

        this.client.updateItem(
            this.client.buildUpdateRequest(
                'Recipes',
                'Name',recipeName,
                this.client.buildListAppendUpdateExpression('Reviews',packedReviewObject)),
            (e,r) => alert(JSON.stringify(e)))
    }

    loadRecipe(recipeName,callback){
        this.client.getDBItems('Recipes',recipeName,e => this.receiveRecipe(e,callback))
    }

    receiveRecipe(response,callback) {
        if(!response.status){
            //the call failed, should we try again?
        }
        callback(this.unpackRecipe(response.payload[0]))
    }

    /**
     * Recipe Object Format:
     * {
     *      Name: Recipe Name
     *      Ingredients: <list> of <String> containing one ingredient specification each
     *      Directions:  <list> of <String> containing one step each
     *      Reviews: <list> of Review <Objects>:
     *      {
     *          username: <String> username of commenter
     *          Comment:  <String> comment assosciated with review, may be empty
     *          Rating:   <int> rating associated with review, out of 5 (stars)
     *          timestamp: timestamp of comment
     *      }
     * }
     */
    unpackRecipe(recipeResponse){
        var reviews = []
        if(recipeResponse.Reviews){
            reviews = recipeResponse.Reviews.L.map((review) => ({
                username: review.M.username.S,
                Comment: review.M.Comment.S,
                Rating: review.M.Rating.N,
                timestamp: review.M.timestamp.N,
            }))
        }
        return {
            Name:recipeResponse.Name.S,
            Ingredients:recipeResponse.Ingredients.L.map((ingredient) => ingredient.S),
            Directions:recipeResponse.Directions.L.map((step) => step.S),
            Reviews:reviews
        }
    }
 }
 export default RecipeHelper;