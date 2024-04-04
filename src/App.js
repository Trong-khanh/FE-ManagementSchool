import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage'; // Adjust the path as necessary
import SignInSide from './Authentication/Login/SignInSide'; // Adjust the path as necessary

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInSide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
