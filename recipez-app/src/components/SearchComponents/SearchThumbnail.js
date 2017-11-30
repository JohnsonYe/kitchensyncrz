/**
 * Title: SearchThumbail.js
 * Author: Michael Yee
 * Date Created: 11/29/2017
 * Description: Thumbnail used to display search results.
 */

import React, {Component} from 'react';

class SearchThumbail extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <div className="col-lg-2 col-md-3 col-sm-6 search-thumbnail" >
                <a href={'/Recipes/'+ this.props.link}>
                    <img src= "https://www.theforkmanager.com/wp-content/uploads/2016/05/thefork-Foodporn-free-marketing-for-your-restaurant.png"
                         className="card-img-top" />
                </a>
                <div className="card-body">
                    <h4 className="card-title">{this.props.link}</h4>
                    <p className="card-text">Description text here</p>

                    <div className="thumbnail-buttons">
                    <a href={'/Recipes/'+this.props.link} className="btn btn-dark col-12">
                            View Recipe
                    </a>
                    <a href="#" className="btn btn-dark col-12">
                            <img className="heart"
                                 width="18"
                                 height="18"
                                 src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png" />
                            Favorite
                    </a>
                    <a href="#" className="btn btn-dark col-12 last-btn">
                            <img className="calendar"
                                 width="18"
                                 height="18"
                                 src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png" />
                            Plan Meal
                    </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchThumbail;