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

        this.loadRecipe     = this.loadRecipe.bind(this);
        this.receiveRecipe  = this.receiveRecipe.bind(this);
        this.unpackRecipe   = this.unpackRecipe.bind(this);
        this.updateReview   = this.updateReview.bind(this);
    }

    /**
     * push a new review object to the review list for the given recipe
     * review object should follow format given below
     */
    updateReview(recipeName,revObj,callback){
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
            // alert(User.getUser().getCookbook())
            User.getUser().getUserData('cookbook')
                .then((cookbook)=>
                {
                    var customRecipe = cookbook[recipeName] ? cookbook[recipeName].S : null;
                    // alert(customRecipe)
                    if(customRecipe){
                        callback(JSON.parse(customRecipe))
                    } else {
                        this.receiveRecipe({status:false,payload:'Item not found!'},callback)
                    }
                })
                .catch((message)=>{this.receiveRecipe({status:false,payload:message},callback)})
        } else {
            this.client.getDBItems('Recipes','Name',[recipeName],e => this.receiveRecipe(e,callback))
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    receiveRecipe(response,callback) {
        if(!response.status){
            //the call failed, should we try again?
            // alert(JSON.stringify(response.payload))
            // alert(callback)
            callback(null,response.payload)
            return
        }
        // alert(JSON.stringify(response))
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
        // alert(recipeResponse)
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