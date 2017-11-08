/**
 * Title: Items.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';

import { Tabs, TabLink, TabContent } from 'react-tabs-redux';

//Components
import FoodItems from './foodItems'
import CookwareItems from './cookwareItems'

class Items extends Component {
    render() {
        return (

            <div>
                <Tabs defaultTab="foodItems" >

                    <div id="Kitchen-Tabs">
                        <TabLink to="foodItems" id="foodItems"> Food Items </TabLink>
                        <TabLink to="cookwareItems" id="cookwareItems"> Cookware Items </TabLink>
                    </div>

                    <div id="Kitchen-Content">
                    <TabContent for="foodItems">
                        <FoodItems />
                    </TabContent>
                    <TabContent for="cookwareItems">
                        <CookwareItems />
                    </TabContent>
                    </div>
                </Tabs>

            </div>
        );

    }
}

export default Items;