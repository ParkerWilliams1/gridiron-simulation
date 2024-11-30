import React, { useState } from 'react';
import Simulate from './components/Simulate';
import Home from './components/Home';
import Navbar from './components/Navbar';
import './styles/main.css';

function App() {
  return (
    <div>
      <Navbar />
      <Simulate />
    </div>
  );
}

export default App;
