/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React, {Component} from 'react';
import PreviewCard from '../cookbookComponents/previewCard';
import RecipeHelper from '../classes/RecipeHelper.js'
// TODO: Some sort of function to automatically add and display preview cards
class PersonalRecipes extends Component{

    constructor(props){
        super(props);


        this.state = {
            recipeList: [],
        };

        this.userInstance = props.userInstance;
        /*console.log('Below is the     personal recipes user instance');
        console.log(this.userInstance);*/
        this.personalRecipeNames = [];
        this.recipeHelper = new RecipeHelper();


        this.userInstance.getCookbook((cookbook_contents) => {
            this.cookbook = cookbook_contents;
            for (let [recipeName, source] of Object.entries(this.cookbook)) {
                if (source !== "none") {
                    this.personalRecipeNames.push(recipeName);
                }
            }

            this.recipeHelper.loadRecipeBatch(this.personalRecipeNames,(recipeObjects)=>{
                console.log(recipeObjects);
                this.setState({
                   recipeList:recipeObjects,
                });
            });

        });

        this.createNewBlankRecipe = this.createNewBlankRecipe.bind(this);
    }

    createNewBlankRecipe(recipeName){

    }

    // Had to change to arrow func to get it to bind properly... should work?
    removeRecipe = (recipeName) => {
        let updatedRecipeList = [];

    };

    render(){

        let recipeCards = [];
        for( let recipe of this.state.recipeList){
            recipeCards.push(<PreviewCard src={recipe}/>);
            recipeCards.push(<PreviewCard src={recipe}/>);
        }


        return(
            <div>

                <div className={"btn btn-success"} onClick={this.addRecipe}>
                    Create Recipe
                </div>
                <div className={"container-fluid"}>
                <div className={"row"}>
                    {recipeCards}
                </div>
                </div>
            </div>
        );
    }

}

export default PersonalRecipes;
