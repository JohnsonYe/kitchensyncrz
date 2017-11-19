/**
 * Title: pantry.js
 * Author: Vivian Lam
 * Date Created: 11/3/2017
 * Description: This file will serve as the cookware page.
 */
import React from 'react'

import User from '../classes/User'

import lists from './lists';
import addBar from './addBar'

import {TodoForm} from './addBar'
import {TodoList} from './lists'

// Mixin, use for multiple extensions
class pantry extends addBar(lists){

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

    render(){

        // Render JSX
        return (
            <div>
                <h3> Pantry Items: ({this.state.data.length})</h3>

                <TodoForm addTodo={this.addTodo.bind(this)}/>
                <TodoList
                    todos={this.state.data}
                    remove={this.removeTodo.bind(this)}
                />
             </div>
        );
    }

}

export default pantry;
