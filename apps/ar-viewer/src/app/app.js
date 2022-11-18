import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Locator from './routes/Home.js';
import Catcher from './routes/Catcher.js';

const App = () => {
  return <Catcher />;
};

export default App;
