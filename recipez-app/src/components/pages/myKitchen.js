/**
 * Title: myKitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';


//Components
import KitchenHeader from '../headerComponent/kitchenHeader'


class Kitchen extends Component {
    render() {
        return (
            <div className="container-fluid">
                <h3>
                    <KitchenHeader />
                </h3>
                Good luck Team Vivian !
            </div>
        );

    }
}

export default Kitchen;