/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React, {Component} from 'react';
import PreviewCard from '../cookbookComponents/previewCard';
// TODO: Some sort of function to automatically add and display preview cards
class PersonalRecipes extends Component{

    constructor(props){
        super(props);

        this.state = {
            imgSrc: "http://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_inbody_900x506/public/1502824044/royal-farms-best-gas-station-food-FT-SS0817.jpg?itok=ig79fdSU",
            recipeMap: new Map(),
            recipeList: [],
            cur_key: 0,
        };

        this.addRecipe();
        this.addRecipe();

        let initial_recipe_list = [];
        for( var [key, value] of this.state.recipeMap){

            initial_recipe_list.push(value);

        }
        this.setState({recipeList: initial_recipe_list});

        this.addRecipe = this.addRecipe.bind(this);
    }

    addRecipe(){
        let cur_key_new = this.state.cur_key;
        let updatedRecipeMap = this.state.recipeMap;
        let updatedRecipeList = this.state.recipeList;

        cur_key_new += 1;
        let newRecipe = <PreviewCard src={"https://i.imgur.com/md8f8.jpg"} removeFunc={this.removeRecipe} key={cur_key_new}/>;
        updatedRecipeMap.set(cur_key_new, newRecipe);
        updatedRecipeList.push(newRecipe);
        this.setState({recipeList: updatedRecipeList, recipeMap: updatedRecipeMap, cur_key: cur_key_new})
    }

    // Had to change to arrow func to get it to bind properly... should work?
    removeRecipe = (card_key) => {

        card_key = parseInt(card_key);
        let updatedRecipes = this.state.recipeMap;
        let updatedRecipeList = [];
        console.log('This is before trying to delete one card\n');
        console.log(updatedRecipes);
        console.log(updatedRecipes.has(card_key));

        updatedRecipes.delete(key);
        console.log('This is after trying to delete one card\n');
        console.log(updatedRecipes);
        console.log(updatedRecipes.has(card_key));
        for( var [key, value] in updatedRecipes) {
            console.log(value);
            updatedRecipeList.push(value);
            console.log(updatedRecipeList);
        }
        this.setState({recipeMap: updatedRecipes, recipeList: updatedRecipeList});

    }

    render(){
        return(
            <div>

                <div className={"btn btn-success"} onClick={this.addRecipe}>
                    Create Recipe
                </div>

                <div className={"row"}>
                    {this.state.recipeList}
                </div>
            </div>
        );
    }

}

export default PersonalRecipes;
