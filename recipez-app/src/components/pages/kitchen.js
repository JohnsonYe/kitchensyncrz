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
                <div className="jumbotron">
                    <h1>Kitchen</h1>
                </div>
                <Tabs defaultTab="foodItems" >

                    <div id="Kitchen-Tabs">
                        <TabLink to="pantry" id="pantry"> Pantry </TabLink>
                        <TabLink to="cookware" id="cookware"> Cookware </TabLink>
                        <TabLink to="exclude" id="exclude"> Preferences </TabLink>
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