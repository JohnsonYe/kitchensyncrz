import React, {Component} from 'react';

function RecipeThumbnail() {
    return (
        <div className="recipe_thumbail col-md-2">
            <img className="card-img-top" src="https://cdn-images-1.medium.com/max/1500/1*qIjh3xPiJDshlL7uSrvQhQ.jpeg" alt="Card image"/>
                <div className="card-body">
                    <h4 className="card-title">BreakFast Sandwich <span className=" badge badge-pill badge-dark">Review</span></h4>
                    <p className="card-text">Some example text some example text. Andrew is the realest engineer</p>
                </div>
                <div className="card-img-overlay">
                    <div className="m-1 pb-1">
                        <a href="#" className="btn btn-light">View Recipe</a><br/>
                    </div>
                    <div className="m-1 pb-1">
                        <a href="#" className="btn btn-light">
                            <img alt="heart"
                                 width="18"
                                 height="18"
                                 src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png" />
                            Favorite
                        </a>
                    </div>

                    <div className="m-1 pb-1">
                        <a href="#" className="btn btn-light">
                            <img alt="heart"
                                 width="18"
                                 height="18"
                                 src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png" />
                            Plan Meal
                        </a>
                    </div>

                </div>
        </div>
);
}

const numResults = 12;

export default class SearchResults extends Component {
    constructor(props) {
        super(props);
        //this.rowElemMax = 6;
        //this.numRows = Math.ceil(numResults / (this.rowElemMax));
        //this.lastRowElems = numResults % this.rowElemMax;

        this.state = {
            array: []
        }

        this.populateResults()
    }

    populateResults() {
        
        var temparray=[];
        for(let i=0; i<numResults; i++){
            temparray[i]=<div className="col-2"><RecipeThumbnail/></div>
        }
        
        this.setState({ array: temparray }, alert("HELLO"))

    }

    render() {
        //ADD THE SEARCH BAR I FORGOT ABOUT IT
        return(
            <div className="container-fluid">
                <div className="row">
                    {/*Search bar goes here*/}
                </div>
                {this.state.array}
            </div>
        );
    }
}

