/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React, {Component} from 'react';
import PreviewCard from '../cookbookComponents/previewCard';

//TODO: Make some sort of function to automatically add and display preview cards
class SavedRecipes extends Component{
    constructor(props){
        super(props);
        this.state = {
            imgSrc:"http://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_inbody_900x506/public/1502824044/royal-farms-best-gas-station-food-FT-SS0817.jpg?itok=ig79fdSU",
            recipes: [],

        }

        this.state.recipes = [
                <div className={"col-md-2"}>
                    <PreviewCard src={this.state.imgSrc}/>
                </div>,
                <div className={"col-md-2"}>
                    <PreviewCard src={this.state.imgSrc}/>
                </div>,
                <div className={"col-md-2"}>
                    <PreviewCard src={this.state.imgSrc}/>
                </div>,
                <div className={"col-md-2"}>
                    <PreviewCard src={this.state.imgSrc}/>
                </div>,
                <div className={"col-md-2"}>
                    <PreviewCard src={this.state.imgSrc}/>
                </div>,
                <div className={"col-md-2"}>
                    <PreviewCard src={this.state.imgSrc}/>
                </div>,
                <div className={"col-md-2"}>
                    <PreviewCard src={this.state.imgSrc}/>
                </div>
        ];

        /*
        this.state.recipes = [

                [<div className="row">
                    <div className="col-md-2">
                        <PreviewCard src={this.state.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                </div>
                ],[
                <div className="row">
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>
                    <div className="col-md-2">
                        <PreviewCard src={this.imgSrc}/>
                    </div>

                </div>]

        ]
        */
    }

    // Method to add a recipe to this.state.recipes, dynamically adding to the recipe display
    addRecipe(){



    }

    render(){
        return(
            <div className={"row"}>
                {this.state.recipes}
            </div>);
    }

}

export default SavedRecipes;