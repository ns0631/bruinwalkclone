import React from 'react';

import HomePageSearchBar from '../Search'

function Home(){
    return (
        <>
        <ul id="homepagenav" className="nav justify-content-end">
            <li className="nav-item">
            <a className="nav-link" href="/addreview">Add Review</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/login">Log In</a>
            </li>
            <li className="nav-item">
            <a className="signupnavbutton nav-link" href="/signup">Sign Up</a>
            </li>
        </ul>
        <h1>Bruinwalk 2.0</h1>
        <div id="mainpagesearchbar">
            <HomePageSearchBar/>
        </div>
      </>
    );
}

export default Home;