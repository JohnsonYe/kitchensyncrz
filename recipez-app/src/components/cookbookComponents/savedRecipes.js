/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React, {Component} from 'react';
import PreviewCard from './previewCard.js';
import RecipeHelper from '../classes/RecipeHelper.js'
// import AndrewPreviewCard from './andrew_previewCard.js';

//TODO: Make some sort of function to automatically add and display preview cards
class SavedRecipes extends Component{

    constructor(props){
        super(props);

        this.getRecipeObjects = this.getRecipeObjects.bind(this);
        this.state = {
            recipeList: [],

        };

        this.userInstance = props.userInstance;
        this.recipeHelper = new RecipeHelper();
        this.getRecipeObjects();

    }

    getRecipeObjects() {
        let savedRecipeNames =[];
        this.userInstance.getCookbook((cookbook_contents) => {
            this.cookbook = cookbook_contents;
            for (let [recipeName, source] of Object.entries(this.cookbook)) {
                if (source === "none") {
                    savedRecipeNames.push(recipeName);
                }
            }

            this.recipeHelper.loadRecipeBatch(savedRecipeNames,(recipeObjects)=>{
                this.setState({
                    recipeList:recipeObjects,
                });
            });

        });
    }

    removeRecipe = (recipeName) => {
        this.userInstance.deleteRecipe(recipeName,this.getRecipeObjects);

    };

    render(){

        let recipeCards = [];
        this.state.recipeList.sort(function(a,b){
           if(a.Name < b.Name) return -1;
           if(a.Name > b.Name) return 1;
           return 0;
        });

         for( let recipe of this.state.recipeList){
             recipeCards.push(<PreviewCard src={recipe} removeFunc={this.removeRecipe} personal={0}/>);
        }
        console.log(recipeCards);
        return(
            <div>
                <div className={"row"}>
                    {recipeCards}
                </div>
            </div>);
    }

}

export default SavedRecipes;