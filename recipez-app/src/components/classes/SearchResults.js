import React from 'react';

function RecipeThumbnail(props) {
    return (
        <div className="card img-fluid" style="width:500px">
            <img className="card-img-top" src="https://cdn-images-1.medium.com/max/1500/1*qIjh3xPiJDshlL7uSrvQhQ.jpeg" alt="Card image" style="width:100%"/>
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
    constructor() {
        super();
        this.rowElemMax = 6;
        this.numRows = Math.ceil(numResults / (this.rowElemMax));
        this.lastRowElems = numResults % this.rowElemMax;
    }

    populateResults(nRows) {
        //creates n - 1 rows of search results
        for (let rowCount = 0; rowCount < nRows - 1; rowCount++) {
            //for each row, create a new div element
            const outerRow = React.createElement("div", {className: "row"}, "");
            //for each div element, create 2 new divs: 1 for col-md-2, 1 for col-sm-12
            for (let colCount = 0; colCount < this.rowElemMax; colCount++) {
                const colmd2 = React.createElement("div", {className: "col-md-2"}, <RecipeThumbnail/>);
                const colsm12 = React.createElement("div", {className: "col-sm-12"}, <RecipeThumbnail/>);
            }
        }

        //create the last (in)complete row
        const lastRow = React.createElement("div", {className: "row"}, "");
        for (let remainderCol = 0; remainderCol < this.lastRowElems; remainderCol++) {
            const lastcolmd2 = React.createElement("div", {className: "col-md-2"}, <RecipeThumbnail/>);
            const lastcolsm12 = React.createElement("div", {className: "col-sm-12"}, <RecipeThumbnail/>);
        }
    }

    render() {
        //ADD THE SEARCH BAR I FORGOT ABOUT IT
        return(
            <div className="container">
                <div className="row">
                    //Search bar goes here
                </div>
            this.populateResults(this.numRows);
            </div>
        );
    }
}

