import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './routes/Home.js';
import Catcher from './routes/Catcher.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catcher" element={<Catcher />} />
      </Routes>
    </Router>
  );
};

export default App;
