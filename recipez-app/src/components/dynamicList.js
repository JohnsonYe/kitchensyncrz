/**
 * Title: dynamicList.js
 * Author: Andrew Sanchez
 * Date Created: 11/22/2017
 *
 * Description: This file could be used for anything that requires that your create a dynamic list.
 *
 * Props to pass in:
 *      renderLI: A method that renders your item with the appropriate data
 *      list: The array that holds all the data you are trying to render
 */

import React, {Component} from 'react';

class DynamicList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            Object.keys(this.props.list).map((key) => {
                return this.props.renderLI;
            })
        );
    }
}

export default DynamicList;