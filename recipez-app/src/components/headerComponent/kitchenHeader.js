/**
 * Title: kitchenHeader.js
 * Author: Vivian Lam
 * Date Created: 11/3/2017
 * Description: This file will contain the Header for the Kitchen.
 */

import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';

class kitchenHeader extends Component {
    render() {
        return (
            <header className = "Kitchen">
                <nav>
                    <ul>
                        <li className="first">
                            <Link to="/Kitchen/Pantry">Pantry</Link>
                        </li>

                        <li>
                            <Link to="/Kitchen/Exclude">Exclude</Link>
                        </li>

                        <li className="last">
                            <Link to="/Kitchen/Tools">Tools</Link>
                        </li>

                    </ul>
                </nav>
            </header>
    );
    }
}

export default kitchenHeader;