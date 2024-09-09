import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./Authentication/Login/LoginPage";
import HomePageAdmin from "./HomePage/HomePageAdmin/HomePageAdmin";
import RegisterPage from "./Authentication/SignUp/RegisterPage";
import ForgotPassword from "./ForgotPassword/ViewForgotPassword";
import AdminStudentPage from "./View /ViewAdmin/AdminStudentPage/AdminStudentPage";
import AdminSemesterPage from "./View /ViewAdmin/Semesters/AdminSemesterPage";
import AdminTeachersPage from "./View /ViewAdmin/AdminTeachersPage/AdminTeachersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/teacher" element={<AdminTeachersPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/admin" element={<HomePageAdmin />} />
        <Route path="/admin/student" element={<AdminStudentPage />} />
        <Route path="/admin/semester" element={<AdminSemesterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
