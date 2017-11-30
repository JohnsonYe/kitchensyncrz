/**
 * Title: homePage.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will serve as the Homepage Content
 */
import React, { Component } from 'react';
import SearchResult from "../classes/SearchResults";

class Homepage extends Component {
    render() {
        return (
            <div>
            <div className="jumbotron">
                <h1>Kitchen Sync</h1>
            </div>
            <div className="container-fluid">
                Homepage content goes here ... Our Website is currently under construction
            </div>
            <SearchResult />
            </div>
        
        );

    }
}

export default Homepage;
