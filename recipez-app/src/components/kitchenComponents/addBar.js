/**
 * Title: addBar.js
 * Author: Vivian Lam
 * Date Created: 11/15/2017
 * Description: This file will serve as an abstract class for add bars.
 */

import React from 'react';
import axios from 'axios'

// Adding to the list, aka the add bar
export const TodoForm = ({addTodo}) => {

    // Input Tracker
    let input;

    return (

        // Add to the form
        <form onSubmit={(e) => {
            e.preventDefault();

            // Preventing empty answers
            if( input.value !== '') {
                addTodo(input.value);

                // Clearing
                input.value = '';
            }
            }}>

            <div class="input-group">
                <input className="form-control col-md-12" type= "text"
                    ref={node => { input = node; }} />

                <button class="add" type="submit" id="add">
                +
                <span></span>
                </button>
            </div>
        </form>
    );
};

// Mixin, use for multiple extensions
const addBar = (addBar) => class extends addBar{

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
}

export default addBar;