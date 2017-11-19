/**
 * Title: lists.js
 * Author: Vivian Lam
 * Date Created: 11/12/2017
 * Description: This file will serve as an abstract class for all
 * the lists.
 */
import React,{ Component } from 'react';
import axios from 'axios';

import {Title, TodoForm} from './addBar';

// The list
export const Todo = ({todo, remove}) => {

    // Each Todo
    return (
        <div className="form-control col-md-12">
        {todo.value}
        <button id="remove" type="submit" onClick={()=> remove(todo.id)}>X</button>
        </div>
    );
}

// Displaying the entire node
export const TodoList = ({todos, remove}) => {


    // Map through nodes
    const todoNode = todos.map((todo)=>
        (<Todo todo={todo} key={todo.id} remove={remove}/>));

    return (<div id ="gap">{todoNode}</div>);
}

class lists extends Component{

    // Lifecycle method
    componentDidMount(){

        // Make HTTP request with Axios
        axios.get(this.apiUrl)
            .then((response) => {
            // Set state with result
            this.setState({data:response.data});
        });
    }

    // Remove todo
    removeTodo(id){

        // Filter all todos except the one to be removed
        const remainder = this.state.data.filter((todo) => {
            return todo.id !== id;
        });

        // Update state with filter
        axios.delete(this.apiUrl+'/'+id)
            .then((response) => {
            this.setState({data: remainder});
        })
            .catch((error) => {
            console.log( error );
        })
    }

    // Render the list components and remove
    render(){
        // Render JSX
        return (
            <div>
                <TodoList
                    todos={this.state.data}
                    remove={this.handleRemove.bind(this)}
                />
            </div>

        );
    }
}

export default lists;
