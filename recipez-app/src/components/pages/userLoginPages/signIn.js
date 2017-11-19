/**
 * Title: signIn.js
 * Author: Osama Qarni
 * Date Created: 11/17/2017
 * Description: This file will serve as the form/page for user sign in.
 */
import Register from "./register";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "../../../scss/App.scss";
import React, { Component } from 'react';

class SignIn extends Component {

    constructor(props){
        super(props);

        this.state = {
            userName: '',
            password: '',
            email: ''

        }
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    validateForm() {
        return this.state.userName.length > 0 && this.state.password.length > 0;
    }



    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Sign in to Kitchen Sync</h1>
                </div>
                <div className="container-fluid" id="Kitchen-Content">
                    sign in form goes here ... Our Website is currently under construction
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            User Name
                            <input type="text" value={this.state.userName} onChange={e => this.setState({userName: e.target.value})}/>
                        </label>
                    </form>
                    <form>
                        <label>
                            Password
                            <input type="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
                        </label>
                    </form>
                    <form>
                        <button
                            disabled={!this.validateForm()}
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                    <form>
                        <label>
                            Don't have an account?
                        </label>
                        <button>
                            Register
                        </button>
                    </form>
                    <div>
                        <h5>user name is: {this.state.userName}</h5>
                        <h5>password is: {this.state.password}</h5>
                    </div>
                </div>
            </div>

        );

    }
}

export default SignIn;