import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import SignInSide from './Authentication/Login/SignInSide';
import HomePageAdmin from  './HomePage/HomePageAdmin/HomePageAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInSide />} />
          <Route path="/admin" element={<HomePageAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
