/**
 * Title: homePage.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will serve as the Homepage Content
 */
import React, { Component } from 'react';

import ShoppingList from './plannerPages/ShoppingList'

class Homepage extends Component {
    constructor(props){
        super(props);

    }

    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Kitchen Sync</h1>
                </div>
                <div className="container-fluid">
                    Good Luck
                </div>

            </div>

        );

    }
}

export default Homepage;
