import React, { useEffect, useState } from 'react';
import {useSearchParams, useParams} from "react-router-dom";
import HomePageSearchBar from '../Search';

import {ProfForClassOverview} from "../Professors";
import ClassOverview from "../ClassInfo";

function ClassesPage() {
    async function initialSearch(classname) {
        return (async () => {
          const rawResponse = await fetch("http://localhost:8000/api/classoverview", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({classname:classname})
          });
          const content = await rawResponse.text();
          if(content === "failure"){
            return [<p style={{backgroundColor:"white",borderRadius:"10px",boxShadow:"5px 5px 5px"}}>No results match your search.</p>];
          }
          const z = JSON.parse(content);
          let finished_data = z.map((a) => {return <ProfForClassOverview data={a} />});
          
          return finished_data;
        })();
      }

    const [searchParams, setSearchParams] = useSearchParams();
    let searchQuery = searchParams.get("q");
    
    const [loaded, setLoaded] = useState(false);
    const [contentofinterest, setContentOfInterest] = useState([]);
    const [restriction, setRestriction] = useState("both");

    useEffect( () => {
        if(!loaded){
            if(!searchQuery){
                setContentOfInterest([<p style={{backgroundColor:"white",borderRadius:"10px",boxShadow:"5px 5px 5px"}}>No results match your search.</p>]);
            } else{
                initialSearch(searchQuery).then( (output) => { setContentOfInterest(output);} );
            }
        }
    }, [loaded, restriction] );

    useEffect(() => {
        document.title = `Results for "${ (searchQuery ? searchQuery : "") }" | Bruinwalk 2.0`;
      }, []);
    
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
            
            <div className="row classpagecontentofinterest">
                {contentofinterest}
            </div>
        </>
    );
}

export default ClassesPage;