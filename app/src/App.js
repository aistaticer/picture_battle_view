import React from 'react';
import Ex2 from './pages/Ex2';
import Brocks from './pages/Blocks';
import Shooting from './pages/Shooting';
import GameScreen from './pages/gameScreen';

import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Rotation from './pages/Rotation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gameScreen" element={<GameScreen />} />
        <Route path="/" element={<Ex2 />} />
        <Route path="/brocks" element={<Brocks />} />
        <Route path="/shooting" element={<Shooting />} />
        <Route path="/rotation" element={<Rotation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
