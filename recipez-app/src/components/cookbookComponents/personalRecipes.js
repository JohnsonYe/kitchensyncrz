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
            imgSrc: "",
            personalRecipes: [],
        }

        this.state.personalRecipes = [
            <div className={"col-md-2"}>
                <PersonalRecipes imgSrc={this.state.imgSrc}/>
            </div>,

            <div className={"col-md-2"}>
                <PersonalRecipes imgSrc={this.state.imgSrc}/>
            </div>

        ];
    }

    addRecipe(){


    }

    render(){
        return(
            <div className={"row"}>
                {this.state.personalRecipes}
            </div>
        );
    }

}

export default PersonalRecipes;
