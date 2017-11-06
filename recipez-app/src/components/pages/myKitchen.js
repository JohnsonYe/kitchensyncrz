/**
 * Title: myKitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';

import { Tabs, TabLink, TabContent } from 'react-tabs-redux';

//Components
import Pantry from './pantry'
import Exclude from './exclude'
import Tools from './tools'

class Kitchen extends Component {
    render() {
        return (

            <div>
                <Tabs defaultTab="Pantry" >

                    <div id="Kitchen-Tabs">
                        <TabLink to="Pantry" id="pantry"> Pantry </TabLink>
                        <TabLink to="Exclude" id="exclude"> Exclude </TabLink>
                        <TabLink to="Tools" id="tools"> Tools </TabLink>
                    </div>

                    <div id="Kitchen-Content">
                    <TabContent for="Pantry">
                        <Pantry />
                    </TabContent>
                    <TabContent for="Exclude">
                        <Exclude />
                    </TabContent>
                    <TabContent for="Tools">
                        <Tools />
                    </TabContent>
                    </div>
                </Tabs>

            </div>
        );

    }
}

export default Kitchen;