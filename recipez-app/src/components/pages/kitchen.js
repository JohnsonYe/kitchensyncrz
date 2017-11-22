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

            <div>

            <div col>
            <h4> Inventory Summary </h4>
            <div class = "row mx-2">
                <div class = "card mx-2 bg-light text-center">
                    <div class = "card-title"> 0 </div>
                    <div class = "card-body"> Total Items: </div>
                </div>
                <div class = "row card mx-2 bg-light text-center">
                    <div class = "card-title"> 2 </div>
                    <div class = "card-body"> Needs restock: </div>
                </div>
            </div>

            <div inp>

            </div>

            </div>
            </div>
        );

    }
}

export default kitchen