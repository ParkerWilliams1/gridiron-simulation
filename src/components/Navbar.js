import React, { useState } from 'react';
import '../styles/navbar.css';

function Navbar() {
  return (
    <div>
    <p id="home">Gridiron Simulation</p>
      <div id="navbar-wrapper">
        <ul className="navbar-buttons">
          <li>
             <a>Home</a>
          </li>
          <li>
              <a>Teams</a>
          </li>
          <li>
              <a>Simulate</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
