/**
 * Title: header.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will contain the Navigation Bar, Logo, and
 * other header(e) things.
 */
import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <div className="App-logo">
                    <img src="https://68.media.tumblr.com/avatar_acbfaaa90b06_128.png"/>
                </div>

                <nav>
                    <ul>
                        <li>
                            <a href={"#"}>Home</a>
                        </li>

                        <li>
                            <a href={"#"}>My Kitchen</a>
                        </li>

                        <li>
                            <a href={"#"}>My Pantry</a>
                        </li>

                        <li>
                            <a href={"#"}>My Planner</a>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Header;