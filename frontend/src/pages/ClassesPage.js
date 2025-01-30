import React, { useEffect, useState } from 'react';
import {useSearchParams, useParams} from "react-router-dom";
import HomePageSearchBar from '../Search';

import {ProfForClassOverview, ProfForClassSummary} from "../Professors";
import {ReadableReview} from "../Reviews";
import ClassOverview from "../ClassInfo";

function ClassesPage() {
    const [officialClassName, setOfficialClassName] = useState("");
    const [classCode, setClassCode] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    let searchQuery = searchParams.get("q");
    let profParameter = searchParams.get("prof");
    
    const [loaded, setLoaded] = useState(false);
    const [contentofinterest, setContentOfInterest] = useState([]);
    const [specificcontent, setSpecificContent] = useState([]);
    const [restriction, setRestriction] = useState("both");

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
          if(z.length > 0){
            setOfficialClassName(z[0][7]);
            setClassCode(z[0][6]);
          }
          let finished_data = z.map((a) => {return <ProfForClassOverview data={a} />});
          
          return finished_data;
        })();
      }
    
      async function retrieveReviews(classname, profname){
        return (async () => {
            const rawResponse = await fetch("http://localhost:8000/api/fetchreviews", {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({classname:classname, profname:profname})
            });
            const content = await rawResponse.text();
            if(content === "failure"){
              //return [<p style={{backgroundColor:"white",borderRadius:"10px",boxShadow:"5px 5px 5px"}}>No results match your search.</p>];
              setContentOfInterest([<p style={{backgroundColor:"white",borderRadius:"10px",boxShadow:"5px 5px 5px"}}>No results match your search.</p>]);
              return [];
            }
            const z = JSON.parse(content);
            if(z.reviews.length > 0){
              setOfficialClassName(z.info.fullclassname);
              setClassCode(z.info.classcode);
            }
            
            return (
                <div class="row">
                    <div class="col-md-3 order-md-2"><ProfForClassSummary data={z.info} /></div>
                    <div class="col-md-9 order-md-1">{z.reviews.map((a) => { return ReadableReview(a)})}</div>
                </div>
            );
          })();
      }

    useEffect( () => {
        if(!loaded){
            if(!searchQuery){
                setContentOfInterest([<p style={{backgroundColor:"white",borderRadius:"10px",boxShadow:"5px 5px 5px"}}>No results match your search.</p>]);
            } else if(!profParameter){
                initialSearch(searchQuery).then( (output) => { setContentOfInterest(output);} );
            } else{
                retrieveReviews(searchQuery, profParameter).then( (output) => {setSpecificContent(output)} );
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
            
            <div className="classpageheaders" style={{display:(classCode ? "block" : "none")}}>
                <h4><a href={"/classes?q=" + classCode}>{classCode}</a></h4>
                <h5>{officialClassName}</h5>
            </div>

            <div className="row classpagecontentofinterest">
                {contentofinterest}
            </div>
            <div className="classpagereviews">
                {specificcontent}
            </div>
        </>
    );
}

export default ClassesPage;