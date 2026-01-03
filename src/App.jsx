import React from 'react';
import AquagasWebsite from './components/AquagasWebsite';
import ChristmasGreeting from './components/ChristmasGreeting';

const App = () => {
  // Check if user is visiting the Christmas page
  const path = window.location.pathname;
  const isChristmasPage = path === '/christmas' || path === '/Year2026' || path === '/christmas.html';
  
  // Show Christmas greeting or main website
  return isChristmasPage ? <ChristmasGreeting /> : <AquagasWebsite />;
};

export default App;
