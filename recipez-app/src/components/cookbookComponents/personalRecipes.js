/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React from 'react';
import PreviewCard from '../cookbookComponents/previewCard';

function PersonalRecipes(props){
    const imgSrc="http://www.gourmetsleuth.com/images/default-source/articles/big-white-chicken.jpg?sfvrsn=8";
    return(
        <div>
            <div className="row">
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>
                <div className="col-md-2">
                    <PreviewCard src={imgSrc}/>
                </div>

            </div>
        </div>
    );

}

export default PersonalRecipes;
