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


//This will modify the CSS properties of the modal
const modalStyle={
    mStyle: {
        top:    '25%',
        left:   '25%',
        right:  '25%',
        bottom: '25%',
        width:  '50%',
        height: '50%'
    }
}

class ThumbnailEx extends Component {
    constructor() {
        super();

        //set modal to be initially off
        this.state = {
            modalIsOn: false;
    }
        ;

        this.changeModalStatus = this.changeModalStatus.bind(this);

        //function to change the status of the modal when the recipe thumbnail is clicked
        changeModalStatus()
        {
            this.setState({modalIsOn: !this.state.modalIsOn});
        }
    }

        render(){
            return(
                //example chicken recipe thumbnail
                <figure>
                    <img onclick={this.changeModalStatus}
                     src="chicken.jpg" alt="Chicken recipe" height="100px" width="100px">
                    <figcaption>Chicken recipe</figcaption>
                </figure>

                //modal that opens when the user clicks the recipe thumbnail
                <Modal
                    isOpen={this.state.modalIsOn}
                    onRequestClose={this.changeModalStatus}
                    contentLabel="Recipe Thumbnail"
                    style={modalStyle}
                >
                    <h1>Chicken Recipe</h1>
                    <img src="chicken.jpg" alt="Chicken recipe big">
                    <p>Average rating: 3.2 stars</p>
                    //hyperlinked button that will take user to recipe's page
                    <form>
                        <input type="button" value="Go to recipe"/>
                        //onclick="window.location.href='RECIPE_URL.HTML'"/>
                    </form>
                    <button onclick={this.changeModalStatus}>Return</button>
               </Modal>
        );
    }
}
export default ThumbnailEx;