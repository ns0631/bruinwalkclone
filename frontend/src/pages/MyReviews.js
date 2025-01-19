import React, { useEffect, useState } from 'react';
import { EditableReview } from "../Reviews";
import HomePageSearchBar from '../Search'

function MyReviews() {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        document.title = 'My Reviews | Bruinwalk 2.0';
      }, []);
      
      async function initialSearch() {
        return (async () => {
          const rawResponse = await fetch("http://localhost:8000/api/myreviews", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          const content = await rawResponse.text();
          if(content === "failure"){
            return;
          }
          const z = JSON.parse(content);
          setReviews(z.map((a) => EditableReview(a)));
        })();
      }

      const [loaded, setLoaded] = useState(false);
      useEffect( () => {
        initialSearch();
    }, [loaded] );
    
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
        </div>
       <div className="ownreviews">
        {reviews}
       </div>
       <div className="alert deletedmessage alert-success alert-dismissible">
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            <span id="actualdeletemessage"><strong>Success! </strong>Your review has been deleted.</span>
        </div>
    </>
    );
}

export default MyReviews;