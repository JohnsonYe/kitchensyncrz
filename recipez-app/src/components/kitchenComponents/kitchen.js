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

class kitchen extends Component {
    render() {
        return (

            <div>
                <Tabs defaultTab="foodItems" >

                    <div id="Kitchen-Tabs">
                        <TabLink to="pantry" id="pantry"> Food Items </TabLink>
                        <TabLink to="cookware" id="cookware"> Cookware Items </TabLink>
                        <TabLink to="exclude" id="exclude"> Excluded </TabLink>
                    </div>

                    <div id="Kitchen-Content">
                    <TabContent for="pantry">
                        <FoodItems />
                    </TabContent>
                    <TabContent for="cookware">
                        <CookwareItems />
                    </TabContent>
                    <TabContent for="exclude">
                        <Excluded />
                    </TabContent>
                    </div>
                </Tabs>

            </div>
        );

    }
}

export default kitchen;