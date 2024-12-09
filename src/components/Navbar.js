import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [activeButton, setActiveButton] = useState('/');

  const handleClick = (path) => {
    setActiveButton(path);
  };

  return (
    <div>
    <p id="home">Gridiron Simulation</p>
    <div id="navbar-wrapper">
      <ul className="navbar-buttons">
        <li>
          <Link
            to="/Home"
            className={activeButton === '/' ? 'active' : ''}
            onClick={() => handleClick('/')}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/Teams"
            className={activeButton === '/projects' ? 'active' : ''}
            onClick={() => handleClick('/projects')}
          >
            Teams
          </Link>
        </li>
        <li>
          <Link
            to="/Simulation"
            className={activeButton === '/work' ? 'active' : ''}
            onClick={() => handleClick('/work')}
         >
            Simulation
          </Link>
        </li>
      </ul>
    </div>
    </div>
  );
};

export default Navbar;
