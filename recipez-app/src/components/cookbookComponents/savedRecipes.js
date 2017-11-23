/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React from 'react';
import PreviewCard from '../cookbookComponents/previewCard';

function SavedRecipes(props){
    const imgSrc="https://www.almanac.com/sites/default/files/styles/primary_image_in_article/public/images/carrots.jpg?itok=_nIMWR5y";
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

export default SavedRecipes;