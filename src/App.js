import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import SignInSide from './Authentication/Login/SignInSide';
import HomePageAdmin from './HomePage/HomePageAdmin/HomePageAdmin';
import AdminStudentPage from './View /ViewAdmin/AdminStudentPage';
import SignUp from "./Authentication/SignUp/SignUp";
import ForgotPassword from "./ForgotPassword/ViewForgotPassword";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<SignInSide />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
                <Route path="/admin" element={<HomePageAdmin />} />
                <Route path="/admin/student" element={<AdminStudentPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;