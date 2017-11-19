/**
 * Title: signIn.js
 * Author: Osama Qarni
 * Date Created: 11/17/2017
 * Description: This file will serve as the form/page for user registration.
 */
import SignIn from './signIn';


import React, { Component } from 'react';

class Register extends Component {

    constructor(props){
        super(props);

        this.state = {
            userName: '',
            email: '',
            password: '',

        }
    }

    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Register for Kitchen Sync</h1>
                </div>
                <div className="container-fluid">
                    Registration form goes here ... Our Website is currently under construction
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            User Name
                            <input type="text" value={this.state.userName} onChange={e => this.setState({userName: e.target.value})}/>
                        </label>
                    </form>
                    <form>
                        <label>
                            Email
                            <input type="text" value={this.state.email} onChange={e => this.setState({email: e.target.value})}/>
                        </label>
                    </form>
                    <form>
                        <label>
                            Password
                            <input type="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
                        </label>
                    </form>
                    <form>
                        <button >
                            Register
                        </button>
                    </form>
                    <form>
                        <label>
                            Have an account already?
                        </label>
                        <button >
                            Sign In
                        </button>
                    </form>
                    <div>
                        <h5>user name is: {this.state.userName}</h5>
                        <h5>email is: {this.state.email}</h5>
                        <h5>password is: {this.state.password}</h5>
                    </div>
                </div>
            </div>

        );

    }
}

export default Register;