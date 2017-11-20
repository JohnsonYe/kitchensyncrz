/**
 * Title: signIn.js
 * Author: Osama Qarni
 * Date Created: 11/17/2017
 * Description: This file will serve as the form/page for user sign in.
 */
import Register from "./register";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "../../../scss/App.scss";
import DBClient from "../../classes/AWSDatabaseClient";
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";

import React, { Component } from 'react';

class SignIn extends Component {

    constructor(props){
        super(props);

        this.client = DBClient.getClient();

        this.state = {
            userName: '',
            password: '',
            email: ''

        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        try {
            await this.login(this.state.userName, this.state.password);
            alert("Logged in");
        } catch (e) {
            alert(e);
        }
    };

    validateForm() {
        return this.state.userName.length > 0 && this.state.password.length > 0;
    }


    login(userName, password) {

        const userPool = new CognitoUserPool({
            UserPoolId: this.client.cognito.USER_POOL_ID,
            ClientId: this.client.cognito.APP_CLIENT_ID
        });

        const user = new CognitoUser({ Username: userName, Pool: userPool });
        const authenticationData = { Username: userName, Password: password };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        return new Promise((resolve, reject) =>
            user.authenticateUser(authenticationDetails, {

                onSuccess: result => resolve(),
                onFailure: err => reject(err)
            })

        );
    }



    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Sign in to Kitchen Sync</h1>
                </div>
                <div className="container-fluid" id="Kitchen-Content">

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
                            onClick={this.handleSubmit}
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

                </div>
            </div>

        );

    }
}

export default SignIn;