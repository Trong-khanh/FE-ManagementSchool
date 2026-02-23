import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HomePage from "./HomePage/HomePage";
import LoginPage from "./Authentication/Login/LoginPage";
import RegisterPage from "./Authentication/SignUp/RegisterPage"
import ForgotPassword from "./View /ForgotPassword/ViewForgotPassword";
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
import ParentPayment from "./View /ViewParent/ParentPayment";
import ViewStudent from "./View /ViewStudent/ViewStudent";
import TuitionFeeNotification from "./View /ViewAdmin/Tuition /TuitionFeeNotification /TuitionFeeNotification";
import PaymentDetailsPage from "./View /Payment/PaymentDetailsPage";
import OrderDetail from "./View /Payment/OrderDetail";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          <Route path="/admin/course-fee" element={<TuitionFeeNotification />} />


          <Route path="/teacher/semester" element={<ViewSemester />} />
          <Route path="/teacher/class" element={<ViewClass />} />
          <Route path="/teacher/score" element={<ViewScore />} />

          <Route path="/parent/viewscore" element={< ViewParent/>} />
          <Route path="/parent/payment" element={< ParentPayment/>} />
          <Route path="/student/viewscore" element={< ViewStudent/>} />

          <Route path="/order-detail" element={<PaymentDetailsPage />} />
          <Route path="/order-detail/:orderId" element={<OrderDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
