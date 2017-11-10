/**
 * Title: App.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will server as the driver of the app,
 * containing all the components
 */
import React, { Component } from 'react';
//Styling
import './css/App.css';

//Router
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

//Components Pages
import Header from './components/headerComponent/header';
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage';
import Search from './components/pages/search';
import Kitchen from './components/pages/myKitchen';
import PlannerPage from './components/pages/myPlanner';
import Cookbook from "./components/pages/myCookbook";

class App extends Component {
  render() {
    return (
        <Router>
        <div className="App">
          <Header />
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
