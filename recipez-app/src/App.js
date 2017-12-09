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

//Jun
import KSLogo from './Image/SplashScreen/LogoFinal2.png';

//Components Pages
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage';
import Search from './components/pages/search';
import Kitchen from './components/pages/kitchen';
import Planner from './components/pages/plannerPages/plannerPageDefault';
import Cookbook from "./components/pages/Cookbook";
import Recipe from "./components/pages/recipe";
import DBClient from "./components/classes/AWSDatabaseClient";
import SignIn from './components/pages/userLoginPages/signIn';
import Register from "./components/pages/userLoginPages/register";
import User from "./components/classes/User";

import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';


class App extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.closeNav = this.closeNav.bind(this);
        this.toggleFunMode = this.toggleFunMode.bind(this);

        this.state = {
            isMenuOpened: false,
            funMode: false,
            cursorWidth:100,
            cursorHeight:100,
            userGreeting: ""
        }
        this.client = DBClient.getClient();

        /*this.moveCallback = ((e)=>{
            this.setState({
                transform:{
                    'left': e.pageX-this.state.cursorWidth/2,
                    'top' : e.pageY-this.state.cursorHeight/2 ,
                }
            });
        });*/
    }

    async componentDidMount() {
        try {
            if (await this.client.authUser()) {
                this.client.authenticated = true;
                User.getUser().reload();
            }
        }
        catch (e) {
            // alert('app mounted: '+e);
        }

        this.setState({isAuthenticating: false});
    }


    componentWillMount() {

        //window.addEventListener('click', this.closeNav);
        //window.addEventListener('mousemove',this.moveCallback)
        this.setState({
            isNavMenuOpened: false,
            isAuthenticating: true,
        })
    }

    componentWillUnmount() {
        //window.removeEventListener('click', this.closeNav);
        //window.removeEventListener('mousemove',this.moveCallback);
    }

    handleClick(e) {
        e.stopPropagation();
        this.setState({ isNavMenuOpened: !this.state.isNavMenuOpened });
    }

    closeNav(e) {
        e.stopPropagation();
        this.setState({isNavMenuOpened: false});
    }

    toggleFunMode() {
        this.setState( {funMode: !this.state.funMode} );
        this.setState({showFollower:!this.state.showFollower})
    }

    

    handleLogout = event => {
        this.setState( {isNavMenuOpened: false} );
        //alert(this.state.isNavMenuOpened);
        //this.handleClick();
        this.client.signOutUser();
        this.client.authenticated = false;
        this.client.user = 'user001';
        User.getUser().reload();
        //alert(this.client.isLoggedIn());
        
    }

    render() {
        var imgsrc = KSLogo;
        {
            this.state.funMode ? imgsrc = "http://vignette1.wikia.nocookie.net/epicrapbattlesofhistory/images/c/c2/Peanut-butter-jelly-time.gif/revision/latest?cb=20141129150614" : null
        }
        
        return (
            !this.state.isAuthenticating &&
            <Router>
                <div className="App">
                    <OffCanvas className="navbar" width='200' transitionDuration='300' isMenuOpened={this.state.isNavMenuOpened} position="left">
                        <OffCanvasBody className="navbar-icon">
                            <div onClick={this.handleClick.bind(this)} style={{cursor:'pointer'}}>
                                {this.state.isNavMenuOpened ?
                                    <img className="ks-icon" src={imgsrc}/>
                                    //null
                                    :
                                    <img className="ks-icon" src={imgsrc}/>
                                }
                            </div>
                        </OffCanvasBody>
                        <OffCanvasMenu className="navbar-menu">
                            <div>
                                <p className="username" >{this.client.authenticated? "Welcome, " + this.client.getUsername():this.state.userGreeting}</p>
                            </div>
                            <ul>
                                <li className="first">
                                    <Link to="/" onClick={this.closeNav}>Home</Link>
                                </li>
                                <li>
                                    <Link to="/Search" onClick={this.closeNav}>Search</Link>
                                </li>
                                <li>
                                    <Link to="/Cookbook" onClick={this.closeNav}>Cookbook</Link>
                                </li>
                                <li>
                                    <Link to="/Kitchen" onClick={this.closeNav}>Kitchen</Link>
                                </li>
                                <li>
                                    <Link to="/Planner" onClick={this.closeNav}>Planner</Link>
                                </li>
                                <li>
                                    {
                                        this.client.authenticated ?
                                            <Link to='/Search' onClick={this.handleLogout.bind(this)}>Sign Out</Link> :
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
                    <Route exact path='/Register' component={Register}/>
                    <Route exact path='/SignIn' component={SignIn}/>
                    <Footer />
                    <div className="row">
                    <span className="col-2 pull-right fun-button">
                    <button className="btn btn-primary btn-xs" onClick={this.toggleFunMode}>Morten's Button</button>
                    </span>
                    </div>
                    {/*<div className='pbj-follower' style={{...this.state.transform,cursor:'none',display:this.state.showFollower?'inline':'none'}}>
                        <img src='/images/Peanut-butter-jelly-time.gif' width={this.state.cursorWidth+'px'} height={this.state.cursorHeight+'px'}/>
                    </div>*/}
                </div>
            </Router>
        );
    }
}

export default App;
