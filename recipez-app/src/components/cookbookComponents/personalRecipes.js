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



        this.addRecipe = this.addRecipe.bind(this);
        this.userInstance = props.userInstance;
        console.log('Below is the personal recipes user instance');
        console.log(this.userInstance);
        this.personalRecipeNames = [];
        this.personalRecipeObjects = [];
        this.recipeHelper = new RecipeHelper();

        this.userInstance.getCookbook((cookbook_contents) => {
            this.cookbook = cookbook_contents;
            for ( let [recipeName,source] of Object.entries(this.cookbook)){
                if(source !=="none"){
                    this.personalRecipeNames.push(recipeName);
                    this.recipeHelper.loadRecipe(recipeName,(recipeObject) => {
                        this.personalRecipeObjects.push(recipeObject);
                        console.log(this.personalRecipeObjects);
                    }, 'user001');
                }
            }

            this.getFullRecipeObjectArray(this.personalRecipeNames,() => {
                this.state = {
                    recipeMap: new Map(),
                    recipeList: this.personalRecipeObjects,
                    cur_key: 0,
                };
            });

        });

    }

    getFullRecipeObjectArray(recipeNames,callback){

        for( let name in recipeNames){



        }

    }

    addRecipe(){
        let cur_key_new = this.state.cur_key;
        let updatedRecipeMap = this.state.recipeMap;
        let updatedRecipeList = this.state.recipeList;

        cur_key_new += 1;
        console.log('the new key is');
        console.log(cur_key_new);

        let newRecipe = <PreviewCard removeFunc={this.removeRecipe} card_key={cur_key_new}/>;

        updatedRecipeMap.set(cur_key_new, newRecipe);
        updatedRecipeList.push(newRecipe);
        this.setState({recipeList: updatedRecipeList, recipeMap: updatedRecipeMap, cur_key: cur_key_new})
    }

    // Had to change to arrow func to get it to bind properly... should work?
    removeRecipe = (card_key) => {

        card_key = parseInt(card_key);
        console.log(card_key);
        let updatedRecipes = this.state.recipeMap;

        let updatedRecipeList = [];

        updatedRecipes.delete(card_key);
        console.log(updatedRecipes);
        for( let [key, value] of updatedRecipes) {
            updatedRecipeList.push(value);
        }
        this.setState({recipeMap: updatedRecipes, recipeList: updatedRecipeList});

    };

    render(){
        return(
            <div>

                <div className={"btn btn-success"} onClick={this.addRecipe}>
                    Create Recipe
                </div>

                <div className={"row"}>
                </div>
            </div>
        );
    }

}

export default PersonalRecipes;
