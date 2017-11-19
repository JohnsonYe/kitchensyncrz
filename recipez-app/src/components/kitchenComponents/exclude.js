/**
 * Title: exclude.js
 * Author: Vivian Lam
 * Date Created: 11/3/2017
 * Description: This file will serve as the exclusion/dietary
 * preference page.
 */
import React from 'react'
import lists from './lists';
import addBar from './addBar'

import {TodoForm} from './addBar'
import {TodoList} from './lists'

// Mixin, use for multiple extensions
class exclude extends addBar(lists){

    constructor(props){

        // Pass props to parent class
        super(props);

        // Set initial state
        this.state = {
            data: []
        }

        // Will change once database is ready
        this.apiUrl = 'http://59fff8591aebc40012b3c60e.mockapi.io/kitchen/exclude'
    }

        render(){

        // Render JSX
        return (
            <div>
                <h3> Excluded items: ({this.state.data.length})</h3>

                <TodoForm addTodo={this.addTodo.bind(this)}/>
                <TodoList
                    todos={this.state.data}
                    remove={this.removeTodo.bind(this)}
                />
             </div>
        );
    }

}

export default exclude;