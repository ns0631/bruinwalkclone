import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import Cookies from 'js-cookie';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReviewPage from "./pages/AddReview";
import ForgotPassword from "./pages/ForgotPassword";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container-fluid" id="outerframehomepage">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="signup" element={ (!Cookies.get('email')) ? <Signup/> : <Navigate to='/'  />} />
          <Route path="login" element={(!Cookies.get('email')) ? <Login/> : <Navigate to='/'  />} />
          <Route path="forgotpassword" element={(!Cookies.get('email')) ? <ForgotPassword/> : <Navigate to='/'  />} />
          <Route path="addreview" element={(Cookies.get('email')) ? <ReviewPage/> : <Navigate to='/login'  />} />
          <Route path="*" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
    <footer><small>Written by Nikhil Sunkad in 2025. A copy of <a href="https://www.bruinwalk.com/">Bruinwalk</a>. Credit to Suzy's and Ollie of 118 Kerckhoff Hall. &copy; UCLA Student Media.</small></footer>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
