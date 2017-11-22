/**
 * File Name: ThumbnailEx.js
 * Author: Michael Li
 * Date: November 16, 2017
 * Description: This file will provide thumbnail that, when clicked on, opens a pop-up window that
 *              contains average rating, recipe title, and a zoomed in picture of the recipe. It will
 *              also contain a hyperlink leading to the recipe's page on the website.
 */

import react from 'react';
import {render} from 'react-dom';
import {Component} from 'react';
import Modal from 'react-modal';
import Lightbox from 'react-image-lightbox';

const images=[
    'chicken.jpg'
];

class ThumbnailEx extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0;
        isOpen: false;
        };
    }


    render() {
        return(
            //My idea is to have a clickable picture that opens a modal, which contains
            //the average rating, an enlarged picture
            //NOTE: Can't seem to find a way to add a hyperlink to the lightbox component
            //The lightbox only shows the recipe name and the average rating.

            <div>
                <img src="chicken.jpg" onclick= {() => this.setState({isOpen: true})}>

        {
            isOpen &&
            < Lightbox
            mainSrc = {images[photoIndex]}
            onCloseRequest = {() =
        >
            this.setState({isOpen: false})
        }
            clickOutsideToClose = true
            imageTitle = React.createElement("h1", null, "Best Chicken NA")
            imageCaption = React.createElement("p", null, "Average rating: 3.2")
                / >
        }
        </div>
    );
    }
}
