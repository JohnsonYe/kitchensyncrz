/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React from 'react';
import PreviewCard from '../cookbookComponents/previewCard';

function PersonalRecipes(props){
    return(
        <div>
            <div className="row">
                <div className="col-md-2">
                    <PreviewCard/>
                </div>
                <div className="col-md-2">
                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <PreviewCard/>
                </div>
                <div className="col-md-2">
                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>
                <div className="col-md-2">

                    <PreviewCard/>
                </div>

            </div>
        </div>
    );

}

export default PersonalRecipes;
