/**
 * Title: register.js
 * Author: Michael Yee
 * Date Created: 11/23/2017
 * Description: Contains the register elements for Kitchen
 * Sync which includes a form for the username, password, confirm
 * password and a submit button adds the credentails to the database.
 */

import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import DBClient from "../classes/AWSDatabaseClient";

class Register extends Component{
    constructor(props){
        super(props);

        // our singleton client
        this.client = DBClient.getClient();

        // fields from register form
        this.state = {
            userName: '',
            password: '',
            confirmpassword: '',
            email: ''
        }
    }

    handleSubmit = async event => {
        // check if password and confirm password match, then register
        if(this.state.password == this.state.confirmpassword){
            try {
                //handle register logic


                alert(this.state.userName + " registered!");
            } 
            catch (e) {
                alert(e);
            }
        }
        else{
            alert("Passwords do not match! Please try again.");
        }
    
    };

    // check if all fields are non empty
    validateForm() {
        return this.state.userName.length > 0 && this.state.email.length > 0
        && this.state.password.length > 0 && this.state.confirmpassword.length > 0;
    }
    
    // enter key submits form 
    handleKeyEnter = (e) => {
        if(e.charCode === 13) {
            if(!this.validateForm()){
                alert("Please fill out all fields!");
            }
            else{
                this.handleSubmit();
            }
        }
    }

    render() {

        return(
            <div>
                <div className="jumbotron">
                    <h1>Register</h1>
                </div>
                <br />
                <br />
                <div className="container" onSubmit={this.handleSubmit}>
                    <div className="col-5 mx-auto">
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
                        type="submit" className="btn-med btn-primary">Register</button>
                        <br />
                        <br />
                        <p>Already have an account? Click <Link to="/SignIn">here</Link> to Sign In!</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;