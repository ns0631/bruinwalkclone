import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import HomePageSearchBar from '../Search';

//Cookies.set('minute', 'minute', { expires: 1 / (24 * 60)});

async function queryBackend(email, password) {
    return (async () => {
      const rawResponse = await fetch("http://localhost:8000/api/login", {
        method: 'POST',
        'credentials': 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password})
      });
      const content = await rawResponse.text();
      const z = JSON.parse(content);
      if(z.outcome === "incorrect"){
        return true;
      } else{
        //localStorage.setItem("email", email);

        //Expires in 15 minutes
        Cookies.set('email', email, { expires: 1 / (24 * 60 / 15), path: '/'});
        return false;
      }
    })();
  }

function Login() {
    useEffect(() => {
        document.title = 'Log In | Bruinwalk 2.0';
      }, []);

      const handleSubmit = (event) => {
        event.preventDefault();
        if(username.length === 0 || password.length === 0){
            setLoginStatus(<div className="alert alert-danger">
                Username and/or password is blank.</div>);
        } else{
            queryBackend(username, password).then( (value) => {
                if(value){
                    setLoginStatus(<div className="alert alert-danger">
                    Email/password is incorrect.</div>);
                } else{
                    setLoginStatus(<div className="alert alert-success">
                    Success! </div>);
                }
            });
        }
      }

      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [loginStatus, setLoginStatus] = useState("");
    
      return (
        <>
        <div className="topleft">
            <h3><a href="/">Bruinwalk 2.0</a></h3>
            <ul className="signupnav nav">
                <li className="nav-item">
                    <a className="nav-link" href="/addreview">Add <br className="buttonbreak"/>Review</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/signup">Sign <br className="buttonbreak"/>Up</a>
                </li>
            </ul>
            <div className="signupsearchbar"><HomePageSearchBar/></div>

            <h2>Log in to Bruinwalk 2.0</h2>
            <form action="/userlogin" className="loginfield" method="POST" onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                    <label for="email" className="form-label">Email:</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" value={username} onInput={(e) => (setUsername(e.target.value))}/>
                </div>
                <div className="mb-3">
                    <label for="pwd" className="form-label">Password:</label>
                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" value={password} onInput={(e) => (setPassword(e.target.value))}/>
                </div>
                <button type="submit" className="btn btn-primary">Log In</button>
                {loginStatus}
                <p><a className="forgotpasswordlink" href="/forgotpassword">Forgot Password?</a></p>
            </form>
        </div>
    </>
    );
}

export default Login;