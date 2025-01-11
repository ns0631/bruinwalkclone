import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import { useState } from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function modify(text, substring){
  let index = text.search(substring);
  if(text == substring){
    return <p><b>{text}</b></p>;
  } else if(index == 0){
    return <p><b>{substring}</b>{text.substring(substring.length, text.length)}</p>;
  } else if(index + substring.length == text.length){
    return <p>{text.substring(0, index)}<b>{substring}</b></p>;
  } else{
    let a = text.substring(0, index);
    let b = text.substr(index, substring.length);
    let c = text.substring(index + substring.length, text.length);
    return <p>{a}<b>{b}</b>{c}</p>;
  }
}

async function queryBackend(input) {
  let x = await fetch("http://localhost:8000/api/search?text=" + input);
  let y = await x.text();
  const z = JSON.parse(y);
  let finished_data = z.map((a) => {return modify(a.name, input.toUpperCase())});
  return finished_data;
}

function HomePageSearchBar() {
  const [name, setName] = useState("");
  const [newTags, setNewTags] = useState([]);

  //useEffect( (name) => queryBackend(name), [name] );
  useEffect(() => {
    if(name.length == 0){
      setNewTags([]);
    } else{
      queryBackend(name).then(
        function(value) {setNewTags(value);}
      );    
      //let x = await queryBackend(name);
    }
  }, [name]); // <- add the count variable here

  return (
    <>
      <form action="/search" method="GET" name="q" id="searchform">
        <div className="mb-3 mt-3">
          <input type="text" className="form-control" id="query" placeholder="Search for a professor or class" name="q" value={name} onChange={(e) => setName(e.target.value)} required/>
        </div>
      </form>
      <div id="dropdownitems">
        {newTags}
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container-fluid" id="outerframehomepage">
      <ul id="homepagenav" className="nav">
        <li className="nav-item">
          <a className="nav-link" href="#">Add Review</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Log In</a>
        </li>
        <li className="nav-item">
          <a id="signupnavbutton" className="nav-link" href="#">Sign Up</a>
        </li>
      </ul>
      <h1>Bruinwalk 2.0</h1>
      <div id="mainpagesearchbar">
        <HomePageSearchBar/>
      </div>
    </div>
    <footer><small>Written by Nikhil Sunkad in 2025. A copy of <a href="https://www.bruinwalk.com/">Bruinwalk</a>. Credit to Suzy's and Ollie of 118 Kerckhoff Hall. &copy; UCLA Student Media.</small></footer>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
