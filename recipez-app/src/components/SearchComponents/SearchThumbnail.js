/**
 * Title: SearchThumbail.js
 * Author: Michael Yee
 * Date Created: 11/29/2017
 * Description: Thumbnail used to display search results.
 *              Current props passed in is the recipe name and score
 */

import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import Recipe from '../pages/recipe';
import RecipeHelper from '../../'

class SearchThumbail extends Component {
    constructor(props){
        super(props);
        this.state = {
            quickView: false
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        
    }

    open() {
        this.setState( {quickView: true} );
    }

    close() {
        this.setState( {quickView: false} );
    }

    render() {
        var imgsrc="http://www.maktabatulmadina.net/img/uploaded/730.jpg"
        return(
            <div className="col-lg-2 col-md-3 col-sm-6 search-thumbnail" >
                {/* Need to check if recipe's img exists, if so use that */}
                <a href={'/Recipes/'+ this.props.link}>
                    <img src={imgsrc}
                         className="card-img-top" />
                </a>
                <div className="card-body">
                    {/* Title of recipe, want to put info about prep time, difficulty, etc
                        instead of score */}
                    <h4 className="card-title">{this.props.link}</h4>
                    <p className="card-text">{'Score: '+JSON.stringify(this.props.score.map((n)=>n.toFixed(2)))}</p>

                    {/* View Recipe, Favorite, and Plan Meal buttons */}
                    <div className="thumbnail-buttons">
                    <a href="javascript:undefined;" onClick={this.open} className="btn btn-dark col-4 quickview">
                            <img className="view"
                                 width="18"
                                 height="18"
                                 src="https://www.bluesource.co.uk/wp-content/uploads/2017/06/magnifying-glass-2-512.png" />
                            
                            
                    </a>
                    <Modal show={this.state.quickView} onHide={this.close}>
                        <Modal.Header>{this.props.link}</Modal.Header>
                        <Modal.Body>
                            <img src={imgsrc} width="100%"/>
                        </Modal.Body>
                    </Modal>
                    <a href="javascript:undefined;" className="btn btn-dark col-4">
                            <img className="heart"
                                 width="18"
                                 height="18"
                                 src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png" />
                            
                    </a>
                    <a href="javascript:undefined;" className="btn btn-dark col-4">
                            <img className="calendar"
                                 width="18"
                                 height="18"
                                 src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png" />
                            
                    </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchThumbail;