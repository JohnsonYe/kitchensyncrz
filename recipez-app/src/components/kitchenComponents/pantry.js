/**
 * Title: pantry.js
 * Author: Vivian Lam
 * Date Created: 11/3/2017
 * Description: This file will serve as the cookware page.
 */

import KitchenLists from './lists';


class pantry extends KitchenLists{
    constructor(props){
        // Pass props to parent class
        super(props);

        // Set initial state
        this.state = {
            data: []
        }
        this.apiUrl = 'http://59fff8591aebc40012b3c60e.mockapi.io/kitchen/pantry'
    }
}

export default pantry;
