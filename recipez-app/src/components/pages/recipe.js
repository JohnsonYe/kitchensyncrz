/**
 * Title: Recipe.js
 * Authors: Alexander Haggart
 * Date Created: 11/11/2017
 * Description: This file will load and display a recipe
 */
import React,{ Component } from 'react';

 class Recipe extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return <div><h1>{this.props.match.params.recipe}</h1></div>
    }

 }

 export default Recipe;