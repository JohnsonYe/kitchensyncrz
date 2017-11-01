import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.min.css';

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
          <p>Testing UI stuff</p>

          <img src="https://media.giphy.com/media/hhGnYTgU2Dplu/giphy.gif" alt="Jake" title="Jake"/>

      </div>
    );
  }
}

export default App;
