/**
 * Title: signIn.js
 * Author: Osama Qarni, Michael Yee
 * Date Created: 11/23/2017
 * Description: Contains the Sign in elements for Kitchen
 * Sync which includes a form for the username and password,
 * and a submit button which validates with the database.
 */

import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import DBClient from "../../classes/AWSDatabaseClient";
import User from "../../classes/User";


class SignIn extends Component {

    constructor(props) {
        super(props);

        this.client = DBClient.getClient();
        this.user =
            this.state = {
                userName: '',
                password: '',
            }
    }

    handleSubmit = async event => {
        try {
            await this.client.login(this.state.userName, this.state.password);
            this.client.authenticated = true;
            this.client.user = this.state.userName;
            User.getUser().reload();
            //alert(this.client.getUsername());
            this.props.history.push("/Search");
        } catch (e) {
            alert('Your username or password was incorrect. Please try again!');
        }
    };

    validateForm() {
        return this.state.userName.length > 0 && this.state.password.length > 0;
    }

    handleKeyEnter = (e) => {
        if (e.charCode === 13) {
            if (!this.validateForm()) {
                alert("Please fill out all the fields!");
            }
            else {
                this.handleSubmit();
            }
        }
    }


    render() {

        return (
            <div>
                <div className="jumbotron">
                    <h1 className="text-white">Sign In</h1>
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
                                           className="form-control" id="userName"/>
                                </div>
                                <div className="form-group">
                                    <label for="pwd">Password:</label>
                                    <input type="password" value={this.state.password}
                                           onChange={e => this.setState({password: e.target.value})}
                                           onKeyPress={this.handleKeyEnter}
                                           className="form-control input-lg" id="pwd"/>
                                </div>
                                <button onClick={this.handleSubmit}
                                        disabled={!this.validateForm()}
                                        type="submit" className="btn-med btn-primary">Login
                                </button>
                                <br/>
                                <br/>
                                <p>Don’t have an account? Click <Link to="/Register">here</Link> to Register!</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;