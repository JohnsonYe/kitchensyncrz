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

        this.loadRecipe     = this.loadRecipe.bind(this);
        this.receiveRecipe  = this.receiveRecipe.bind(this);
        this.unpackRecipe   = this.unpackRecipe.bind(this);
        this.updateReview   = this.updateReview.bind(this);
    }

    /**
     * push a new review object to the review list for the given recipe
     * review object should follow format given below
     */
    updateReview(recipeName,revObj){
        //re-pack the review object
        var packedReviewObject = this.packReview(revObj)

        this.client.updateItem(//create the reviews field if it doesnt exist
            this.client.buildUpdateRequest('Recipes','Name',recipeName,this.client.buildFieldCreateExpression('Reviews',{M:{}})),
            function (e1,r1){ //chain update calls to keep them synced up
            if(e1){
                this.client.updateItem( //add the review to the reviews field once the create call resolves
                    this.client.buildUpdateRequest(
                        'Recipes',
                        'Name',recipeName,
                        this.client.buildMapUpdateExpression('Reviews',revObj.username,packedReviewObject)),
                    (r)=>{})
            } else {
                //field creation failed (!) (?)
            }
        }.bind(this))
    }

    loadRecipe(recipeName,callback){
        this.client.getDBItems('Recipes','Name',recipeName,e => this.receiveRecipe(e,callback))
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
     *      Ingredients: <List> of <String> containing one ingredient specification each
     *      Directions:  <List> of <String> containing one step each
     *      Reviews:     <List> of Review <Objects>:
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
            // alert(JSON.stringify(Object.entries(recipeResponse.Reviews.M)))
            reviews = this.unpackReview(recipeResponse.Reviews)
        }
        return {
            Name:recipeResponse.Name.S,
            Ingredients:recipeResponse.Ingredients.L.map((ingredient) => ingredient.S),
            Directions:recipeResponse.Directions.L.map((step) => step.S),
            Reviews:reviews
        }
    }

    unpackReview(packedReview){
        return Object.entries(packedReview.M).map((review) => ({
                        username:   review[1].M.username.S,
                        Comment:    review[1].M.Comment.S,
                        Rating:     review[1].M.Rating.N,
                        timestamp:  review[1].M.timestamp.N,
                    }))
    }

    packReview(revObj){
        return {M:{
                username:   {S:revObj.username},
                Comment:    {S:revObj.Comment},
                Rating:     {N:revObj.Rating},
                timestamp:  {N:revObj.timestamp},
            }
        }
    }
 }
 export default RecipeHelper;