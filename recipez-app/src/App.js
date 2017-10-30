import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Recipe-Z Homepage</h1>
        </header>
        <p className="App-intro">
          Our website is currently under construction.
        </p>
	<h2>Hello world!</h2>
      </div>
    );
  }
}

export default App;
