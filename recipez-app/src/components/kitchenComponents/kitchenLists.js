/**
 * Title: lists.js
 * Author: Vivian Lam
 * Date Created: 11/14/2017
 * Description: This file extends from list. It includes the list and the
 * add bar.
 */

import React from 'react';
import axios from 'axios';

import {TodoForm} from './addBar';
import {TodoList} from './lists';

import lists from './lists';

// Keep track of total items
export const Counter = ({todoCount}) => {
    return (
        <div>
            <h3> Items: ({todoCount})</h3>
        </div>
    );
}

// For mutiple windows
window.id = 0;
class kitchenLists extends lists{

    // Add todo handler
    addTodo(val){

        // Assemble data
        const todo = {value: val}

        // Update data
        axios.post(this.apiUrl, todo)
            .then((response) => {
            this.setState({data: this.state.data.concat(response.data) });
        })
            .catch((error)=>{
            console.log(error);
        });
    }

    // Render the addbar and the list
    render(){

        // Render JSX
        return (
            <div>
                <Counter todoCount={this.state.data.length}/>
                <TodoForm addTodo={this.addTodo.bind(this)}/>
                <TodoList
                    todos={this.state.data}
                    remove={this.removeTodo.bind(this)}
                />
            </div>

        );
    }

}

export default kitchenLists;