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
import User from "../../classes/User";

class Register extends Component {
    constructor(props) {
        super(props);

        this.client = DBClient.getClient();
        this.user = User.getUser();

        this.state = {
            userName: '',
            password: '',
            confirmpassword: '',
            email: '',
            confirmationCode: '',
            newUser: null
        }
    }

    handleSubmit = async event => {

        if (this.state.password == this.state.confirmpassword) {
            try {
                const newUser = await this.client.register(this.state.userName, this.state.password, this.state.email);
                this.setState({
                    newUser: newUser
                });

                //alert("Registered!");
            } catch (e) {
                alert(e);
            }
        }
        else {
            alert("Passwords do not match! Please try again.");
        }

    };

    handleConfirmationSubmit = async event => {

        try {
            await this.client.confirmUser(this.state.newUser, this.state.confirmationCode);
            await this.client.authenticateUser(
                this.state.newUser,
                this.state.email,
                this.state.password
            );

            this.client.authenticated = true;
            this.client.user = this.state.userName;
            this.client.authUser();
            this.user.createUser(this.state.userName, () => User.getUser().reload());
            this.props.history.push("/Search");
        } catch (e) {
            alert(e);
        }
    };

    validateForm() {
        return this.state.userName.length > 0 && this.state.email.length > 0
            && this.state.password.length > 0 && this.state.confirmpassword.length > 0;
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleKeyEnter = (e) => {
        if (e.charCode === 13) {
            if (!this.validateForm()) {
                alert("Please fill out all fields!");
            }
            else {
                this.handleSubmit();
            }
        }
    };

    handleKeyEnterConfirmation = (e) => {
        if (e.charCode === 13) {
            if (!this.validateConfirmationForm()) {
                alert("Please enter a code!");
            }
            else {
                this.handleConfirmationSubmit();
            }
        }
    };

    renderConfirmationForm() {

        return (
            <div>
                <div className="jumbotron">
                    <h1 className="text-white">Email Confirmation</h1>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-5 mx-auto">
                            <div className=".mx-auto">
                                <div className="form-group .mx-auto">
                                    <label for="pwd2">Confirmation Code:</label>
                                    <input type="password" value={this.state.confirmationCode}
                                           onChange={e => this.setState({confirmationCode: e.target.value})}
                                           onKeyPress={this.handleKeyEnterConfirmation}
                                           className="form-control" id="pwd2"/>
                                </div>
                                <button onClick={this.handleConfirmationSubmit}
                                        disabled={!this.validateConfirmationForm()}
                                        type="submit" className="btn btn-primary .mx-auto">Confirm Email
                                </button>
                                <p>Check your email for confirmation code.</p>
                                <br/>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderRegisterForm() {

        return (
            <div>
                <div className="jumbotron">
                    <h1 className="text-white">Register</h1>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-5 mx-auto">
                            <div className=".mx-auto">
                                <div className="form-group">
                                    <label for="userName">Username:</label>
                                    <input type="text" value={this.state.userName}
                                           bsSize="large"
                                           onChange={e => this.setState({userName: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="userName"/>
                                </div>
                                <div className="form-group">
                                    <label for="email">Email Address:</label>
                                    <input type="text" value={this.state.email}
                                           onChange={e => this.setState({email: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="email"/>
                                </div>
                                <div className="form-group .mx-auto">
                                    <label for="pwd">Password:</label>
                                    <input type="password" value={this.state.password}
                                           onChange={e => this.setState({password: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="pwd"/>
                                </div>
                                <div className="form-group .mx-auto">
                                    <label for="pwd2">Confirm Password:</label>
                                    <input type="password" value={this.state.confirmpassword}
                                           onChange={e => this.setState({confirmpassword: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control" id="pwd2"/>
                                </div>
                                <button onClick={this.handleSubmit}
                                        disabled={!this.validateForm()}
                                        type="submit" className="btn-med btn-primary .mx-auto">Register
                                </button>
                                <br/>
                                <br/>

                                <p>Already have an account? Click <Link to="/SignIn">here</Link> to Sign In!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.state.newUser === null
                    ? this.renderRegisterForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}

export default Register;