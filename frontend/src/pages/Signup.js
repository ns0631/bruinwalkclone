import React, { useEffect, useState } from 'react';

import HomePageSearchBar from '../Search'

async function queryBackend(email, password) {
    return (async () => {
      const rawResponse = await fetch("http://localhost:8000/api/signup", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password})
      });
      const content = await rawResponse.text();
      const z = JSON.parse(content);
      if(z.outcome === "already exists"){
        return true;
      } else{
        return false;
      }
    })();
  }

function Signup() {
    useEffect(() => {
        document.title = 'Sign Up | Bruinwalk 2.0';
      }, []);

      const handleSubmit = (event) => {
        event.preventDefault();
        if(username.length === 0 || password.length === 0){
            setSignupStatus(<div className="alert alert-danger">
                Username and/or password is blank.</div>);
        } else if(password.length < 8){
            setSignupStatus(<div className="alert alert-danger">
                Password must be at least 8 characters.</div>);
        } else if(!username.includes("ucla.edu")){
            setSignupStatus(<div className="alert alert-danger">
                Enter your UCLA email.</div>);
        } else{
            queryBackend(username, password).then( (value) => {
                if(!value){
                    setSignupStatus(<div className="alert alert-success">
                    <strong>Account created!</strong> Check your email.</div>);
                } else{
                    setSignupStatus(<div className="alert alert-danger">
                    Email is already affiliated with an account.</div>);
                }
            });
        }
      }

      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [signupStatus, setSignupStatus] = useState("");
    
      return (
        <>
        <div className="topleft">
            <h3><a href="/">Bruinwalk 2.0</a></h3>
            <ul className="signupnav nav">
                <li className="nav-item">
                    <a className="nav-link" href="/addreview">Add <br className="buttonbreak"/>Review</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/login">Log <br className="buttonbreak"/>In</a>
                </li>
            </ul>
            <div className="signupsearchbar"><HomePageSearchBar/></div>

            <h2>Sign Up for Bruinwalk 2.0</h2>
            <form action="/accountcreated" className="signupfield" method="POST" onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                    <label for="email" className="form-label">Email:</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" value={username} onInput={(e) => (setUsername(e.target.value))}/>
                </div>
                <div className="mb-3">
                    <label for="pwd" className="form-label">Password:</label>
                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" value={password} onInput={(e) => (setPassword(e.target.value))}/>
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
                {signupStatus}
            </form>
        </div>
    </>
    );
}

export default Signup;