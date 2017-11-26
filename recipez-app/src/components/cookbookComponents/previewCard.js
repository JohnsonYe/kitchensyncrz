/**
 * File: previewCard.js
 * Author: Matthew Taylor
 *
 * Serves as the basic preview card, either for the saved recipes or for the personal recipes
 */

/**
 * TODO: Need to make it so you can pass a prop for the type (personal/saved) and dynamically determine which it will be
 */
import React from 'react';

function PreviewCard(props){
    return(

        <div className="card saved-recipes">
            <img className="card-img-top" src={props.src} alt="Food" />

            <div className="card-body">
                <h6 className="card-title">

                </h6>
                <p className="card-text">
                    Description
                </p>
                <a href="#" className="btn btn-primary">
                    Edit
                </a>
            </div>

        </div>


    );

}

export default PreviewCard;