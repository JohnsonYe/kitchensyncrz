/**
 * Title: cookware.js
 * Author: Vivian Lam
 * Date Created: 11/3/2017
 * Description: This file will serve as the cookware page.
 */

import kitchenLists from './kitchenLists';
import addBar from './addBar';

// Mixin, use for multiple extension
class cookware extends addBar(kitchenLists){

    constructor(props){
        // Pass props to parent class
        super(props);

        // Set initial state
        this.state = {
            data: []
        }

        // Will change once the database is set up
        this.apiUrl = 'http://59fff8591aebc40012b3c60e.mockapi.io/kitchen/tools'
    }
}
export default cookware;
