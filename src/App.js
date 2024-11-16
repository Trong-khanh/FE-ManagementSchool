import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./Authentication/Login/LoginPage";
import RegisterPage from "./Authentication/SignUp/RegisterPage"
import ForgotPassword from "./ForgotPassword/ViewForgotPassword";
import AdminStudentPage from "./View /ViewAdmin/AdminStudentPage/AdminStudentPage";
import AdminSemesterPage from "./View /ViewAdmin/Semesters/AdminSemesterPage";
import AdminTeachersPage from "./View /ViewAdmin/AdminTeachersPage/AdminTeachersPage";
import ViewSemester from "./View /ViewTeacher/ViewSemester";
import ViewClass from "./View /ViewTeacher/ViewClass";
import ViewScore from "./View /ViewTeacher/ViewScore";
import AdminClass from "./View /ViewAdmin/AdminClass/AdminClass";
import AdminScore from "./View /ViewAdmin/AdminScore/AdminScore";
import NextClass from "./View /ViewAdmin/AdminNextClass/NextClass"
import ViewParent from "./View /ViewParent/ViewParent";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/teacher" element={<AdminTeachersPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        <Route path="/admin/student" element={<AdminStudentPage />} />
        <Route path="/admin/semester" element={<AdminSemesterPage />} />
        <Route path="/admin/class" element={<AdminClass />} />
        <Route path="/admin/score" element={<AdminScore />} />
        <Route path="/admin/nextclass" element={<NextClass />} />

        <Route path="/teacher/semester" element={<ViewSemester />} />
        <Route path="/teacher/class" element={<ViewClass />} />
        <Route path="/teacher/score" element={<ViewScore />} />

        <Route path="/parent/viewsocreandpayment" element={< ViewParent/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
