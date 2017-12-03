/**
 * Title: App.js
 * Authors: Andrew Sanchez, Vivian Lam, Michael Yee
 * Date Created: 11/2/2017
 * Description: This file will server as the driver of the app,
 * containing all the components. Added a navbar using an offcanvas
 * element.
 */

import React, { Component } from 'react';

//Styling
import './css/App.css';

//Router
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom'


//Components Pages
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage';
import Search from './components/pages/search';
import Kitchen from './components/pages/kitchen';
import Planner from './components/pages/plannerPages/plannerPageDefault';
import Cookbook from "./components/pages/myCookbook";
import Recipe from "./components/pages/recipe";
import DBClient from "./components/classes/AWSDatabaseClient";
import SignIn from './components/pages/userLoginPages/signIn';
import Register from "./components/pages/userLoginPages/register";
import User from "./components/classes/User";

import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';


class App extends Component {

    constructor(props){
        super(props);

        this.client = DBClient.getClient();


    }

    async componentDidMount() {
        try {
            if (await this.client.authUser()) {
                this.client.authenticated = true;
            }
        }
        catch(e) {
            alert(e);
        }

        this.setState({ isAuthenticating: false});
    }


    componentWillMount() {
        this.setState({
            isMenuOpened: false,
            isAuthenticating: true

        })
    }

    handleClick() {
        this.setState({ isMenuOpened: !this.state.isMenuOpened });
    }

    handleLogout = event => {
        this.handleClick();
        this.client.signOutUser();
        this.client.authenticated = false;
        this.client.user = 'user001';
        User.getUser().reload();
        //alert(this.client.isLoggedIn());
    }

    render() {
        return (
            !this.state.isAuthenticating &&
            <Router>
                <div className="App">
                    <OffCanvas className="navbar" width='200' transitionDuration='300' isMenuOpened={this.state.isMenuOpened} position="left">
                        <OffCanvasBody className="navbar-icon">
                            <a href="#" onClick={this.handleClick.bind(this)}>
                                {<img className="ks-icon" src="http://www.free-icons-download.net/images/a-kitchen-icon-80780.png" />}
                                {/*<img className="ks-icon" src="/images/Peanut-butter-jelly-time.gif" />*/}
                            </a>
                        </OffCanvasBody>
                        <OffCanvasMenu className="navbar-menu">
                            <ul>
                                <li className="first">
                                    <Link to="/" onClick={this.handleClick.bind(this)}>Home</Link>
                                </li>
                                <li>
                                    <Link to="/Search" onClick={this.handleClick.bind(this)}>Browse</Link>
                                </li>
                                <li>
                                    <Link to="/Cookbook" onClick={this.handleClick.bind(this)}>Cookbook</Link>
                                </li>
                                <li>
                                    <Link to="/Kitchen" onClick={this.handleClick.bind(this)}>Kitchen</Link>
                                </li>
                                <li>
                                    <Link to="/Planner" onClick={this.handleClick.bind(this)}>Planner</Link>
                                </li>
                                <li>
                                    {
                                        this.client.authenticated ? 
                                        <Link to='/Search' onClick={this.handleLogout}>Sign Out</Link> : 
                                        <Link to='/SignIn' onClick={this.handleClick.bind(this)}>Sign in</Link>
                                    }
                                </li>
                            </ul>
                        </OffCanvasMenu>
                    </OffCanvas>


                    <Route exact path='/' component={Homepage} />
                    <Route exact path='/Search' component={Search} />
                    <Route exact path='/Cookbook' component={Cookbook} />
                    <Route exact path='/Kitchen' component={Kitchen} />
                    <Route exact path='/Planner' component={Planner} />
                    <Route exact path='/Recipes/:recipe' component={Recipe} />
                    <Route exact path='/Recipes/:user/:recipe' component={Recipe} />
                    <Route exact path='/Register' component={Register} />
                    <Route exact path='/SignIn' component={SignIn} />
                    <Footer />
                </div>
            </Router>
    );
  }
}

export default App;
