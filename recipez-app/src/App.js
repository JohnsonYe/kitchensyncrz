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
import Header from './components/headerComponent/header';
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage';
import Search from './components/pages/search';
import Kitchen from './components/pages/myKitchen';
import PlannerPage from './components/pages/myPlanner';
import Cookbook from "./components/pages/myCookbook";

import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';

class App extends Component {

  componentWillMount() {
    this.setState({
      isMenuOpened: false
    })
  }

  handleClick() {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  }

  render() {
    return (
        <Router>
        <div className="App">
          <OffCanvas className="navbar" width='200' transitionDuration='300' isMenuOpened={this.state.isMenuOpened} position="left">
            <OffCanvasBody className="navbar-icon">
              <a href="#" onClick={this.handleClick.bind(this)}>
                <img className="ks-icon" src="http://www.free-icons-download.net/images/a-kitchen-icon-80780.png" />
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
                    <Link to="/" onClick={this.handleClick.bind(this)}>Register</Link>
                </li>
                <li>
                    <Link to="/" onClick={this.handleClick.bind(this)}>Sign in</Link>
                </li>
                <li>
                    <Link to="/" onClick={this.handleClick.bind(this)}>Sign out</Link>
                </li>
              </ul>
            </OffCanvasMenu>
          </OffCanvas>

          <Route exact path='/' component={Homepage} />
          <Route exact path='/Search' component={Search} />
          <Route exact path='/Cookbook' component={Cookbook} />
          <Route exact path='/Kitchen' component={Kitchen} />
          <Route exact path='/Planner' component={PlannerPage} />
          

          <Footer />
        </div>
        </Router>
    );
  }
}

export default App;
