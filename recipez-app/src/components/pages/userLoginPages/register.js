/**
 * Title: signIn.js
 * Author: Osama Qarni
 * Date Created: 11/17/2017
 * Description: This file will serve as the form/page for user registration.
 */
import SignIn from './signIn';


import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import DBClient from "../../classes/AWSDatabaseClient";

/*function RegisterForm(props){
    return (
        <div className=".mx-auto">
            <div className="form-group">
                <label for="email">Email address:</label>
                <input type="email" className="form-control" id="email" />
            </div>
            <div className="form-group .mx-auto">
                <label for="pwd">Password:</label>
                <input type="password" className="form-control" id="pwd" />
            </div>
            <div className="form-group .mx-auto">
                <label for="pwd2">Confirm Password:</label>
                <input type="password" className="form-control" id="pwd2" />
            </div>
            <button type="submit" className="btn btn-primary .mx-auto">Register</button>
            <br />
            <br />
            <p>Already have an account? Click <Link to="/SignIn">here</Link> to Sign In!</p>
        </div>
    );
}*/

class Register extends Component{
    constructor(props){
        super(props);

        this.client = DBClient.getClient();

        this.state = {
            userName: '',
            password: '',
            confirmpassword: '',
            email: ''
        }
    }

    handleSubmit = async event => {
        if(this.state.password == this.state.confirmpassword){
            try {
                //handle register logic

                alert("Registered!");
            } catch (e) {
                alert(e);
            }
        }
        else{
            alert("Passwords do not match! Please try again.");
        }

    };

    validateForm() {
        return this.state.userName.length > 0 && this.state.email.length > 0
            && this.state.password.length > 0 && this.state.confirmpassword.length > 0;
    }

    handleKeyEnter = (e) => {
        if(e.charCode === 13) {
            if(!this.validateForm()){
                alert("Please fill out all fields!");
            }
            else{
                this.handleSubmit;
            }
        }
    }

    render() {

        return(
            <div>
                <div className="jumbotron">
                    <h1>Register</h1>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-5 mx-auto">
                            <div className=".mx-auto">
                                <div className="form-group">
                                    <label for="userName">Username:</label>
                                    <input type="text" value={this.state.userName}
                                           onChange={e => this.setState({userName: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="userName" />
                                </div>
                                <div className="form-group">
                                    <label for="email">Email Address:</label>
                                    <input type="text" value={this.state.email}
                                           onChange={e => this.setState({email: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="email" />
                                </div>
                                <div className="form-group .mx-auto">
                                    <label for="pwd">Password:</label>
                                    <input type="password" value={this.state.password}
                                           onChange={e => this.setState({password: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="pwd" />
                                </div>
                                <div className="form-group .mx-auto">
                                    <label for="pwd2">Confirm Password:</label>
                                    <input type="password" value={this.state.confirmpassword}
                                           onChange={e => this.setState({confirmpassword: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="pwd2" />
                                </div>
                                <button onClick={this.handleSubmit}
                                        disabled={!this.validateForm()}
                                        type="submit" className="btn btn-primary .mx-auto">Register</button>
                                <br />
                                <br />
                                <p>Already have an account? Click <Link to="/SignIn">here</Link> to Sign In!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;