/**
 * Title: homePage.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will serve as the Homepage Content
 */
import React, { Component } from 'react';

class Homepage extends Component {
    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Kitchen Sync</h1>
                </div>
                <div className="container-fluid">
                    Homepage content goes here ... Our Website is currently under construction
                    <p className="text-center"><button className="btn btn-success btn-large">MORTEN'S BUTTON</button></p>
                </div>
                <div class="popover bs-tether-element bs-tether-element-attached-middle bs-tether-element-attached-left bs-tether-target-attached-middle bs-tether-target-attached-right fade bs-tether-enabled" role="tooltip" id="popover640845" container='btn' >
                    <h3 class="popover-title">Popover title</h3>
                    <div class="popover-content">And here's some amazing content. It's very engaging. Right?</div>
                </div>
            </div>
        
        );

    }
}

export default Homepage;
