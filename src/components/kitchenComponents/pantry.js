/**
 * Title: pantry.js
 * Author: Vivian Lam
 * Date Created: 11/3/2017
 * Description: This file will serve as the cookware page.
 */

import KitchenLists from './kitchenLists';
import addBar from './addBar'

// Mixin, use for multiple extensions
class pantry extends addBar(KitchenLists){

    constructor(props){

        // Pass props to parent class
        super(props);

        // Set initial state
        this.state = {
            data: []
        }

        //Will change once database is ready
        this.apiUrl = 'http://59fff8591aebc40012b3c60e.mockapi.io/kitchen/pantry'
    }

}

export default pantry;
