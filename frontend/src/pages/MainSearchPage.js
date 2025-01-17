import React, { useEffect, useState } from 'react';
import {useSearchParams} from "react-router-dom";
import HomePageSearchBar from '../Search';

function MainSearchPage() {
    async function initialSearch(input) {
        return (async () => {
          const rawResponse = await fetch("http://localhost:8000/api/search", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({text: input, restriction:restriction})
          });
          const content = await rawResponse.text();
          const z = JSON.parse(content);
          let finished_data = z.map((a) => {return <p>{a.name}</p>});
          if(finished_data.length == 0){
            return <p>No results match your search.</p>
          }
          return finished_data;
        })();
      }

    const [searchParams, setSearchParams] = useSearchParams();
    let searchQuery = searchParams.get("q");

    useEffect(() => {
        document.title = "Search | Bruinwalk 2.0";
      }, []);
    
    const [loaded, setLoaded] = useState(false);
    const [contentofinterest, setContentOfInterest] = useState([]);
    const [restriction, setRestriction] = useState("both");

    useEffect( () => {
        if(!loaded){
            if(!searchQuery){
                setContentOfInterest([<p>No results match your search.</p>]);
            } else{
                initialSearch(searchQuery).then( (output) => { setContentOfInterest(output); } );
            }
        }
    }, [loaded, restriction] );

    function handleSubmit(e){
        e.preventDefault();
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
            </div>
            
            <div id="contentofinterest">
                {contentofinterest}
            </div>

            <form action="/filters" className="filtersform" method="POST" onSubmit={handleSubmit}>
                <p style={{textAlign:"center"}}>Filters</p>
                <p>
                    <input id="checkProfs" value="profs" name="restrictions" type="radio" className="form-check-input" onInput={(e) => {setRestriction(e.target.value)}}/>
                    <label for="checkProfs" className="form-check-label"> Professors</label>
                </p>
                <p>
                    <input id="checkClasses" value="classes" name="restrictions" type="radio" className="form-check-input" onInput={(e) => {setRestriction(e.target.value)}}/>
                    <label for="checkClasses" className="form-check-label"> Classes</label>
                </p>
                <p>
                    <input id="checkAll" value="both" name="restrictions" type="radio" className="form-check-input" onInput={(e) => {setRestriction(e.target.value)}}/>
                    <label for="checkAll" className="form-check-label"> All</label>
                </p>
            </form>
        </>
    );
}

export default MainSearchPage;