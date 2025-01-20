import React, { useEffect, useState } from 'react';
import {useSearchParams} from "react-router-dom";
import HomePageSearchBar from '../Search';

var months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September",
    "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function ReviewEditing(props){
      const [submissionStatus, setSubmissionStatus] = useState("");

      const [overallScore, setOverallScore] = useState(props.data.overallRating.toString());
      const [ease, setEase] = useState(props.data.ease.toString());
      const [workload, setWorkload] = useState(props.data.workload.toString());
      const [clarity, setClarity] = useState(props.data.clarity.toString());
      const [helpfulness, setHelpfulness] = useState(props.data.helpfulness.toString());

      const [reviewText, setReviewText] = useState(props.data.reviewBody);

      async function submitReview(id, overallScore, ease, workload, clarity, helpfulness, reviewText) {
        if(reviewText.length == 0){
            setSubmissionStatus(<div className="alert alert-danger">
                    One or more fields is empty.</div>);
            return;
        }
        return (async () => {
          const rawResponse = await fetch("http://localhost:8000/api/editreview", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:id, overallScore:overallScore, ease:ease, workload:workload, clarity:clarity, helpfulness:helpfulness, reviewText:reviewText})
          });
          const content = await rawResponse.text();
          if(content === "success"){
            setSubmissionStatus(<div className="alert alert-success">
                    <strong>Success! </strong>Your review has been updated.</div>);
          } else if(content === "failure"){
            setSubmissionStatus(<div className="alert alert-danger">
                    <strong>Failure. </strong>You aren't logged in.</div>);
          } else{
            setSubmissionStatus(<div className="alert alert-danger">
                   Something went wrong.</div>);
          }
        })();
      }

      const handleSubmit = (event) => {
        event.preventDefault();
        submitReview(props.data.id, overallScore, ease, workload, clarity, helpfulness, reviewText);
      }

    let date = new Date(props.data.recordDate);
    let text = props.data.reviewBody;
    
      return (
        <>
        <div className="topleft mainReviewForm">
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

            <h2>Edit your Review!</h2>
            <p className="anonymity">All reviews are anonymous!</p>
            <form action="/editreview" className="reviewbox" method="POST" onSubmit={handleSubmit}>
                <div className="userreview editable">
                    <p className="publishdate">{days[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
                    <p className="courseinfo">{props.data.class} — {props.data.prof}</p>
                    <p className="timetaken">{props.data.quarterTaken} {props.data.yearTaken}</p>
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
                    <input type="range" name="likedclass" className="form-range" min="1" max="5" required value={overallScore} onInput={(e) => {setOverallScore(e.target.value);}}/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Easiness</a>
                    <a className="formsubsubheading">This class was easy</a>
                    <input type="range" name="ease" className="form-range" min="1" max="5" required value={ease} onInput={(e) => {setEase(e.target.value);}}/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Workload</a>
                    <a className="formsubsubheading">Workload was manageable</a>
                    <input type="range" name="likedclass" className="form-range" min="1" max="5" required value={workload} onInput={(e) => {setWorkload(e.target.value);}}/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Clarity</a>
                    <a className="formsubsubheading">Professor was clear</a>
                    <input type="range" name="clarity" className="form-range" min="1" max="5" required value={clarity} onInput={(e) => {setClarity(e.target.value);}}/>
                </div>
                <div className="informationAttribute">
                    <a className="formsubheading">Helpfulness</a>
                    <a className="formsubsubheading">Professor was helpful</a>
                    <input type="range" name="helpfulness" className="form-range" min="1" max="5" required value={helpfulness} onInput={(e) => {setHelpfulness(e.target.value);}}/>
                </div>
                <hr/>
                <p className="heading">Comments</p>
                <p>Review</p>
                <textarea name="fullreviewtext" class="reviewtextarea" placeholder="Do you feel like you learned enough? What would you change about this class?" value={reviewText} onInput={(e) => {setReviewText(e.target.value);}}></textarea>
                <button type="submit" className="submitReview btn btn-primary">Update Review</button>
                {submissionStatus}
                <div className="additionalp"><p>Here</p></div>
            </form>
        </div>
       
    </>
    );
}

function EditReview() {
    async function initialReviewFetch(input) {
        return (async () => {
          const rawResponse = await fetch("http://localhost:8000/api/fetchreviewbyid", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: input})
          });
          const content = await rawResponse.text();
          if(content === "not found"){
            return "not found";
          } else if (content === "failure"){
            return "failure";
          }
          const z = JSON.parse(content);
          return z;
        })();
      }

    const [searchParams, setSearchParams] = useSearchParams();
    let searchQuery = searchParams.get("id");

    useEffect(() => {
        document.title = "Edit a Review | Bruinwalk 2.0";
      }, []);
    
    const [loaded, setLoaded] = useState(false);
    const [pageContent, setPageContent] = useState("");

    useEffect( () => {
        if(!loaded){
            if(!searchQuery){
                setPageContent(<div className="topleft mainReviewForm">
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
                    <div className="alert reviewfetchfailure alert-danger">No review specified.</div>
                </div>);
            } else{
                initialReviewFetch(searchQuery).then( (output) => { 
                    if(output === "failure"){
                        setPageContent(
                            <div className="topleft mainReviewForm">
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
                                <div className="alert reviewfetchfailure alert-danger">You aren't logged in.</div>
                            </div>
                        );
                    } else if(output === "not found"){
                        setPageContent(
                            <div className="topleft mainReviewForm">
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
                                <div className="alert reviewfetchfailure alert-danger">Review not found.</div>
                            </div>
                        );
                    } else{
                        setPageContent(
                            <ReviewEditing data={output}/>
                        );
                    }
                } );
            }
        }
    }, [loaded] );

    function handleSubmit(e){
        e.preventDefault();
    }

    return (
        <>
            {pageContent}
        </>
    );
}

export default EditReview;