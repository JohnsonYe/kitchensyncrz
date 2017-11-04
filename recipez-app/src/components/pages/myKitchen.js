/**
 * Title: myKitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

//Components
import Pantry from './pantry'
import Exclude from './exclude'
import Tools from './tools'

class Kitchen extends Component {
    render() {
        return (
            <div id="Kitchen-Tabs">

                <Tabs>
                    <TabList id="Kitchen-List">
                        <Tab id="tab"> Pantry </Tab>
                        <Tab id="tab"> Exclude </Tab>
                        <Tab id="tab"> Tools </Tab>
                    </TabList>

                    <TabPanel title="Pantry">
                        <h2> Pantry! </h2>
                        <Pantry />
                    </TabPanel>
                    <TabPanel title="Exclude">
                        <h2> Exclude! </h2>
                        <Exclude />
                    </TabPanel>
                    <TabPanel title="Tools">
                        <h2> Tools! </h2>
                        <Tools />
                    </TabPanel>
                </Tabs>

            </div>
        );

    }
}

export default Kitchen;