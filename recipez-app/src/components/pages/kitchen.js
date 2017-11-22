/**
 * Title: Kitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux';

//Components
import FoodItems from '../kitchenComponents/pantry'
import CookwareItems from '../kitchenComponents/cookware'
import Excluded from '../kitchenComponents/exclude'

import card from '../pages/kitchenPages/kitchenComponents'

class kitchen extends Component {

    render() {

        return (

            <div className="container">

                <div className="row">
                    <h1> Inventory Summary </h1>
                </div>

                <div className="row">
                <div className="col-md-2">
                    <div className = "card mg-3 bg-light text-center">
                        <div className = "card-title"><h1>0</h1></div>
                        <div className = "card-body"> Total Items: </div>
                    </div>
                </div>&nbsp;

                <div className="col-md-2">
                    <div class = "card mg-3 bg-light text-center">
                        <div class = "card-title"><h1>2</h1></div>
                        <div class = "card-body"> Needs restock: </div>
                    </div>
                </div>
                </div>

                <div className="row">
                </div>
            </div>
        );

    }
}

export default kitchen