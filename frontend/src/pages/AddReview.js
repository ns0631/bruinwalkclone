import React, { useEffect, useState } from 'react';

import HomePageSearchBar from '../Search'

function ReviewPage() {
    useEffect(() => {
        document.title = 'Add a Review | Bruinwalk 2.0';
      }, []);

      const [signupStatus, setSignupStatus] = useState("");
      const [dept, setDept] = useState("");
      const [available_classes, setAvailableClasses] = useState([]);
      const [available_profs, setAvailableProfs] = useState([]);

      async function queryBackend(department) {
        return (async () => {
          const rawResponse = await fetch("http://localhost:8000/api/addreviewinfo", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({department: department})
          });
          const content = await rawResponse.text();
          const z = JSON.parse(content);
          
          setAvailableClasses(z.classes.map((a) => (<option value={a}>{a}</option>) ));

          setAvailableProfs(z.professors.map( (a) => (<option value={a}>{a}</option>) ));
        })();
      }

      useEffect( () => {queryBackend(dept);}, [dept] );

      const handleSubmit = (event) => {
        event.preventDefault();
      }
    
      return (
        <>
        <div className="topleft">
            <h3><a href="/">Bruinwalk 2.0</a></h3>
            <ul className="signupnav nav">
                <li className="nav-item">
                    <a className="nav-link" href="/signup">Sign <br className="buttonbreak"/>Up</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/login">Log <br className="buttonbreak"/>In</a>
                </li>
            </ul>
            <div className="signupsearchbar"><HomePageSearchBar/></div>

            <h2>Add a Review!</h2>
            <p className="anonymity">All reviews are anonymous!</p>
            <form action="/submitreview" className="reviewbox" method="POST" onSubmit={handleSubmit}>
                <p className="heading">Class Information</p>
                <div className="informationAttribute">
                    <p className="descriptorparagraph">Department</p>
                    <select name="department" onInput={(e) => {setDept(e.target.value);}} required>
                        <option disabled selected value> -- select an option -- </option>
                        <option value="math">Math</option>
                        <option value="cs">Computer Science</option>
                        <option value="ece">Electrical/Computer Engr.</option>
                        <option value="physics">Physics</option>
                    </select>
                </div>
                <div className="informationAttribute">
                    <p className="descriptorparagraph">Class</p>
                    <select name="class_name" id="class_name" disabled={available_classes.length === 0} required>
                        <option disabled selected value> -- select an option -- </option>
                        {available_classes}
                    </select>
                </div>
                <div className="informationAttribute">
                    <p className="descriptorparagraph">Professor</p>
                    <select name="professor_name" id="professor_name" disabled={available_profs.length === 0} required>
                        <option disabled selected value> -- select an option -- </option>
                        {available_profs}
                    </select>
                </div>
                <div className="informationAttribute">
                    <p className="descriptorparagraph">Year Taken</p>
                    <input type="number" name="yeartaken" min="2010" max="2025" required/>
                </div>
                <div className="informationAttribute">
                    <p className="descriptorparagraph">Quarter Taken</p>
                    <select name="quartertaken" required>
                        <option disabled selected value> -- select an option -- </option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                    </select>
                </div>
                <div className="informationAttribute">
                    <p className="descriptorparagraph">Grade Received</p>
                    <select name="gradereceived" required>
                        <option disabled selected value> -- select an option -- </option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>
                </div>
                <hr/>
                <p className="heading">Ratings</p>
                <div className="ratingScale">
                    <p>Strongly<br/>Disagree</p>
                    <p>Disagree</p>
                    <p>Neutral</p>
                    <p>Agree</p>
                    <p>Strongly<br/>Agree</p>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Overall</a>
                    <a className="formsubsubheading">I liked this class</a>
                    <input type="range" name="likedclass" className="form-range" min="0" max="4" required/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Easiness</a>
                    <a className="formsubsubheading">This class was easy</a>
                    <input type="range" name="ease" className="form-range" min="0" max="4" required/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Workload</a>
                    <a className="formsubsubheading">Workload was manageable</a>
                    <input type="range" name="likedclass" className="form-range" min="0" max="4" required/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Clarity</a>
                    <a className="formsubsubheading">Professor was clear</a>
                    <input type="range" name="clarity" className="form-range" min="0" max="4" required/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Helpfulness</a>
                    <a className="formsubsubheading">Professor was helpful</a>
                    <input type="range" name="helpfulness" className="form-range" min="0" max="4" required/>
                </div>
                <hr/>
                <p className="heading">Comments</p>
                <p>Review</p>
                <textarea name="fullreviewtext" class="reviewtextarea" placeholder="Do you feel like you learned enough? What would you change about this class?"></textarea>
                <button type="submit" className="submitReview btn btn-primary">Submit Review</button>
                {signupStatus}
            </form>
        </div>
    </>
    );
}

export default ReviewPage;