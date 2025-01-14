import React, { useEffect, useState } from 'react';

import HomePageSearchBar from '../Search'

async function queryBackend(email) {
    await fetch("http://localhost:8000/api/forgotpassword", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email})
      });
}

function ForgotPassword() {
    useEffect(() => {
        document.title = 'Forgot Password | Bruinwalk 2.0';
      }, []);

      const handleSubmit = (event) => {
        event.preventDefault();
        if(username.length === 0){
            setStatus(<div className="alert alert-danger">
                Email is blank.</div>);
        } else{
            queryBackend(username).then( () => {setStatus(<div className="alert alert-success">
                    If your email is registered, your credentials have been sent. </div>);}
            );
        }
      }

      const [username, setUsername] = useState("");
      const [status, setStatus] = useState("");
    
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

            <h2>Forgot your password?</h2>
            <form action="/forgotuserpassword" className="forgotpasswordfield" method="POST" onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                    <label for="email" className="form-label">Enter email:</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" value={username} onInput={(e) => (setUsername(e.target.value))}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                {status}
            </form>
        </div>
    </>
    );
}

export default ForgotPassword;