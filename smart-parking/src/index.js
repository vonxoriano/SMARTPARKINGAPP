import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ParkingProvider } from './context/ParkingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ParkingProvider>
    <App />
  </ParkingProvider>
);
