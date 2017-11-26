/**
 * Title: RecipeHelper.js
 * Authors: Alexander Haggart
 * Date Created: 11/14/2017
 * Description: This file will interact with the DBClient to handle Recipe-related actions
 */
import React from 'react';
import DBClient from '../classes/AWSDatabaseClient';
import User from '../classes/User';



 class RecipeHelper{
    constructor(){
        this.client = DBClient.getClient();
        this.client.registerPrototype(RecipeHelper.RecipePrototype)
        this.client.registerPrototype(RecipeHelper.ReviewPrototype)

        this.createRecipe = this.createRecipe.bind(this);
        this.loadRecipe     = this.loadRecipe.bind(this);
        this.receiveRecipe  = this.receiveRecipe.bind(this);
        this.updateReview   = this.updateReview.bind(this);
        this.testUnpack = this.testUnpack.bind(this);
    }

     /**
      * Use this method to build a recipe object
      * 
      * Recipe Object Format:
      * {
      *      Name: <String> recipe Name
      *      Author: <String> username of user that created this recipe
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
    createRecipe(name,ingredients,directions){
        return {
            Name: name,
            Author: this.client.getUsername(),
            Ingredients: ingredients,
            Directions: directions,
            Reviews:{},
            TimeCost:-1,
            Difficulty:-1
        }
    }

    testUnpack(revObj){
        return this.client.getPrototype('RECIPE',revObj)
    }

    /**
     * push a new review object to the review list for the given recipe
     * review object should follow format given below
     */
    updateReview(recipeName,revObj,callback){ //TODO optimize this so we dont make two DB calls every time
        //re-pack the review object
        this.client.updateItem(//create the reviews field if it doesnt exist
            this.client.buildUpdateRequest('Recipes','Name',recipeName,this.client.buildFieldCreateExpression('Reviews',{M:{}})),
            function (e1,r1){ //chain update calls to keep them synced up
            if(e1){
                this.client.updateItem( //add the review to the reviews field once the create call resolves
                    this.client.buildUpdateRequest(
                        'Recipes',
                        'Name',recipeName,
                        this.client.buildMapUpdateExpression('Reviews',revObj.username,RecipeHelper.packReview(revObj))),
                    callback)
            } else {
                //field creation failed (!) (?)
                callback({status:false,payload:e1})
            }
        }.bind(this))

        // this.client.updateItem(
        //     this.client.buildUpdateRequest(
        //         'Recipes',
        //         'Name',recipeName,
        //         this.client.combineUpdateExpressions(
        //             this.client.buildFieldCreateExpression('Reviews',{M:{}}),
        //             this.client.buildMapUpdateExpression('Reviews',revObj.username,packedReviewObject))),
        //     this.client.alertResponseCallback)
    }

    loadRecipe(recipeName,callback,custom){
        if(custom){ 
            //load recipe from JSON string
            User.getUser(custom).getUserData('cookbook') //queue up the custom display after user data loads
                .then((cookbook)=>
                {
                    // alert(JSON.stringify(cookbook[recipeName]))
                    var customRecipe = cookbook[recipeName];
                    if(customRecipe){
                        callback(JSON.parse(customRecipe))
                    } else {
                        this.receiveRecipe({status:false,payload:recipeName+' not found in cookbook!'},callback)
                    }
                })
                //verification failed, user data failed to load, or invalid recipe name --> pass the error object we get
                .catch((message)=>this.receiveRecipe({status:false,payload:message.toString()},callback)) 
        } else {
            this.client.getDBItems('Recipes','Name',[recipeName],e => this.receiveRecipe(e,callback))
        }
    }

    receiveRecipe(response,callback) {
        if(!response.status){
            //the call failed, should we try again?
            callback(null,response.payload)
            return
        }

        callback(this.client.unpackItem(response.payload[0],RecipeHelper.RecipePrototype))
        // var unpacked = this.client.unpackItem(response.payload[0],RecipeHelper.RecipePrototype)
        // alert(JSON.stringify(unpacked))
        // alert(JSON.stringify(this.client.packItem(unpacked,RecipeHelper.RecipePrototype)))
        // callback(RecipeHelper.unpackRecipe(response.payload[0]))
    }
 }

 RecipeHelper.ReviewPrototype = {
    _NAME:'REVIEW',
    username:{type:'S'},
    Comment:{type:'S'},
    Rating:{type:'N'},
    timestamp:{type:'N'}
 }

 RecipeHelper.RecipePrototype = {
    _NAME:'RECIPE',
    Name:{type:'S'},
    Ingredients:{type:'L',inner:{type:'S'}},
    Directions:{type:'L',inner:{type:'S'}},
    Reviews:{type:'M',inner:{type:RecipeHelper.ReviewPrototype._NAME}},
    Author:{type:'S'},
    Difficulty:{type:'N'},
    TimeCost:{type:'N'}
 }

 //============================================================================================
 /*
  * this code is no longer in use but is kept (for now) for convenience and testing
  */

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
RecipeHelper.unpackRecipe = function(recipeResponse){
    var reviews = []
    if(recipeResponse.Reviews){
        // alert(JSON.stringify(Object.entries(recipeResponse.Reviews.M)))
        reviews = RecipeHelper.unpackReview(recipeResponse.Reviews)
    }
    // alert(recipeResponse)
    return {
        Name:recipeResponse.Name.S,
        Ingredients:recipeResponse.Ingredients.L.map((ingredient) => ingredient.S),
        Directions:recipeResponse.Directions.L.map((step) => step.S),
        Reviews:reviews
    }
}

RecipeHelper.packRecipe = function(r){
    return {
        Name:{S:r.Name},
        Ingredients:{L:r.Ingredients.map((ingredient)=>{S:ingredient})},
        Directions:{L:r.Directions.map((step)=>{S:step})},
        Reviews:RecipeHelper.packReview(r.Reviews)
    }

}

RecipeHelper.unpackReview = function(packedReview){
    return Object.entries(packedReview.M).map((review) => ({
                    username:   review[1].M.username.S,
                    Comment:    review[1].M.Comment.S,
                    Rating:     review[1].M.Rating.N,
                    timestamp:  review[1].M.timestamp.N,
                }))
}

RecipeHelper.packReview = function(revObj){
    return {M:{
            username:   {S:revObj.username},
            Comment:    {S:revObj.Comment},
            Rating:     {N:revObj.Rating},
            timestamp:  {N:revObj.timestamp},
        }}
}
 export default RecipeHelper;