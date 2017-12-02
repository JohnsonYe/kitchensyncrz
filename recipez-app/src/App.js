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
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';


class App extends Component {
    constructor(props){
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.closeNav = this.closeNav.bind(this);
        this.toggleFunMode = this.toggleFunMode.bind(this);

        this.state = {
            isMenuOpened: false,
            funMode: false
        }
    }

    componentWillMount() {
        window.addEventListener('click', this.closeNav);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.closeNav);
    }

    handleClick(e) {
        e.stopPropagation();
        this.setState({ isMenuOpened: !this.state.isMenuOpened });
    }

    closeNav(e) {
        e.stopPropagation();
        this.setState( {isMenuOpened: false });
    }

    toggleFunMode() {
        this.setState( {funMode: !this.state.funMode} );
    }

    render() {
        var imgsrc = "http://www.free-icons-download.net/images/a-kitchen-icon-80780.png";
        {this.state.funMode? imgsrc="http://vignette1.wikia.nocookie.net/epicrapbattlesofhistory/images/c/c2/Peanut-butter-jelly-time.gif/revision/latest?cb=20141129150614":null}
        
        return (
            <Router>
                <div className="App">
                    <OffCanvas className="navbar" width='200' transitionDuration='300' isMenuOpened={this.state.isMenuOpened} position="left">
                        <OffCanvasBody className="navbar-icon">
                            <a href="#" onClick={this.handleClick.bind(this)}>
                                {this.state.isMenuOpened ?                                 
                                //set to null if you want banana man to kill himself
                                //<img className="ks-icon" src={imgsrc} />
                                null
                                :
                                <img className="ks-icon" src={imgsrc} />
                                }
                            </a>
                        </OffCanvasBody>
                        <OffCanvasMenu className="navbar-menu">
                            <ul>
                                <li className="first">
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/Search">Browse</Link>
                                </li>
                                <li>
                                    <Link to="/Cookbook">Cookbook</Link>
                                </li>
                                <li>
                                    <Link to="/Kitchen">Kitchen</Link>
                                </li>
                                <li>
                                    <Link to="/Planner">Planner</Link>
                                </li>
                                <li>
                                    <Link to="/">Register</Link>
                                </li>
                                <li>
                                    <Link to="/">Sign in</Link>
                                </li>
                                <li>
                                    {/*need to add onClick to handle sign out here instead of handleClick */}
                                    <Link to="/" onClick={this.handleClick.bind(this)}>Sign out</Link>
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
                    <span className="col-2 pull-right fun-button">
                    <button className="btn btn-primary btn-sm" onClick={this.toggleFunMode}>Hello There</button>
                    </span>
                    
                </div>
            </Router>
        );
    }
}

export default App;
