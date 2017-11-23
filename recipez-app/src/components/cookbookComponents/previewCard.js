/**
 * File: previewCard.js
 * Author: Matthew Taylor
 *
 * Serves as the basic preview card, either for the saved recipes or for the personal recipes
 */

import React from 'react';

function PreviewCard(props){
    return(

        <div className="card mg-2">
            <img className="card-img-top" src="https://timedotcom.files.wordpress.com/2017/02/chicken-bird.jpg?quality=85" alt="Food" />

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