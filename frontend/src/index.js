import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Cookies from 'js-cookie';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";

import ReviewPage from "./pages/AddReview";
import ForgotPassword from "./pages/ForgotPassword";
import MainSearchPage from "./pages/MainSearchPage";
import MyReviews from "./pages/MyReviews";
import EditReview from "./pages/EditReview";

import ClassesPage from "./pages/ClassesPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container-fluid" id="outerframehomepage">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="signup" element={ (!Cookies.get('email')) ? <Signup/> : <Navigate to='/'  />} />
          <Route path="login" element={(!Cookies.get('email')) ? <Login/> : <Navigate to='/'  />} />
          <Route path="logout" element={(Cookies.get('email')) ? <Logout/> : <Navigate to='/'  />} />

          <Route path="forgotpassword" element={(!Cookies.get('email')) ? <ForgotPassword/> : <Navigate to='/'  />} />
          <Route path="addreview" element={(Cookies.get('email')) ? <ReviewPage/> : <Navigate to='/login'  />} />
          <Route path="search" element={<MainSearchPage/>} />
          
          <Route path="myreviews" element={(Cookies.get('email')) ? <MyReviews/> : <Navigate to='/login'  />} />
          <Route path="editreview" element={(Cookies.get('email')) ? <EditReview/> : <Navigate to='/login' />} />
          <Route path="classes" element={ <ClassesPage/> } />

          <Route path="*" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
    <footer><small>Written by Nikhil Sunkad in 2025. A copy of <a href="https://www.bruinwalk.com/" target="_blank">Bruinwalk</a>. Credit to Suzy's and Ollie of 118 Kerckhoff Hall. &copy; UCLA Student Media.</small></footer>
  </React.StrictMode>
);

//<Route path="classes" element={ <ClassesPage/> } />
//<Route path="professors" element={ <ProfessorsPage/> } />

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
