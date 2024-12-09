import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Simulate from './components/Simulate';
import Teams from './components/Teams';
import Navbar from './components/Navbar';
import BracketComponent from './components/playoffBracket';
import './styles/main.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/Teams" element={ <Teams /> } />
        <Route path="/Simulation" element={ <Simulate /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
