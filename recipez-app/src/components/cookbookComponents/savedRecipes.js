/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React, {Component} from 'react';
import PreviewCard from './previewCard.js';
import RecipeHelper from '../classes/RecipeHelper.js';

//TODO: Make some sort of function to automatically add and display preview cards
class SavedRecipes extends Component{

    constructor(props){
        super(props);


        this.state = {
            recipeList: [],
        };

        this.userInstance = props.userInstance;
        console.log('Below is the personal recipes user instance');
        console.log(this.userInstance);
        this.savedRecipeNames = [];
        this.recipeHelper = new RecipeHelper();


        this.userInstance.getCookbook((cookbook_contents) => {
            this.cookbook = cookbook_contents;
            for (let [recipeName, source] of Object.entries(this.cookbook)) {
                if (source === "none") {
                    this.savedRecipeNames.push(recipeName);
                }
            }

            this.recipeHelper.loadRecipeBatch(this.savedRecipeNames,(recipeObjects)=>{
                console.log(recipeObjects);
                this.setState({
                    recipeList:recipeObjects,
                });
            });

        });

    }

    // Method to add a recipe to this.state.recipes, dynamically adding to the recipe display
    removeRecipe(){



    }

    render(){

        let recipeCards = [];
        this.state.recipeList.sort(function(a,b){
           if(a.Name < b.Name) return -1;
           if(a.Name > b.Name) return 1;
           return 0;
        });

         for( let recipe of this.state.recipeList){
             recipeCards.push(<PreviewCard src={recipe}/>);
        }

        return(
            <div>
                <div className={"row"}>
                    {recipeCards}
                </div>
            </div>);
    }

}

export default SavedRecipes;