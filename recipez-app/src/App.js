/**
 * Title: App.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will server as the driver of the app,
 * containing all the components
 */
import React, { Component } from 'react';
import './css/App.css';
import Header from './components/headerComponent/header';
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
          <Homepage />
        <Footer />
      </div>
    );
  }
}

export default App;
